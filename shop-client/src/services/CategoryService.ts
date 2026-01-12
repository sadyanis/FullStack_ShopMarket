import axios, { AxiosResponse } from 'axios';
import http from '../utils/http';
import { Category, MinimalCategory, ResponseArray } from '../types';

export function getCategories(page: number, size: number): Promise<ResponseArray<Category>> {
    return http.get(`/categories?page=${page}&size=${size}`);
}

export function getCategory(id: string): Promise<AxiosResponse<Category>> {
    return http.get(`/categories/${id}`);
}

export function createCategory(category: MinimalCategory): Promise<AxiosResponse<Category>> {
    return http.post(`/categories`, category);
}

export function editCategory(category: MinimalCategory): Promise<AxiosResponse<Category>> {
    return http.put(`/categories`, category);
}

export function deleteCategory(id: string): Promise<AxiosResponse<Category>> {
    return http.delete(`/categories/${id}`);
}
