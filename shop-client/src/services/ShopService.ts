import { MinimalShop } from './../types/shop';
import axios, { AxiosResponse } from 'axios';
import { Shop } from '../types';
import { ResponseArray } from '../types/response';

export function getShops(page: number, size: number): Promise<ResponseArray<Shop>> {
    return axios.get(`${process.env.REACT_APP_API}/shops?page=${page}&size=${size}`);
}

export function getShopsSorted(page: number, size: number, sort: string): Promise<ResponseArray<Shop>> {
    return axios.get(`${process.env.REACT_APP_API}/shops?page=${page}&size=${size}&sortBy=${sort}`);
}

export function getShopsFiltered(page: number, size: number, urlFilters: string): Promise<ResponseArray<Shop>> {
    return axios.get(`${process.env.REACT_APP_API}/shops?page=${page}&size=${size}${urlFilters}`);
}

export function getShop(id: string): Promise<AxiosResponse<Shop>> {
    return axios.get(`${process.env.REACT_APP_API}/shops/${id}`);
}

export function createShop(shop: MinimalShop): Promise<AxiosResponse<Shop>> {
    return axios.post(`${process.env.REACT_APP_API}/shops`, shop);
}

export function editShop(shop: MinimalShop): Promise<AxiosResponse<Shop>> {
    return axios.put(`${process.env.REACT_APP_API}/shops`, shop);
}

export function deleteShop(id: string): Promise<AxiosResponse<Shop>> {
    return axios.delete(`${process.env.REACT_APP_API}/shops/${id}`);
}
// Fonction pour la recherche Elasticsearch
// Nouvelle méthode pour la recherche Elasticsearch
export function searchShops(
    page: number, 
    size: number, 
    query?: string,
    inVacations?: boolean,
    createdAfter?: string,
    createdBefore?: string
): Promise<ResponseArray<Shop>> {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
    });

    if (query) params.append('query', query);
    if (inVacations !== undefined) params.append('inVacations', inVacations.toString());
    if (createdAfter) params.append('createdAfter', createdAfter);
    if (createdBefore) params.append('createdBefore', createdBefore);

    return axios.get(`${process.env.REACT_APP_API}/shops/search?${params.toString()}`);
}
