import axios, { AxiosResponse } from 'axios';
import http from '../utils/http';
import { MinimalProduct, Product, ResponseArray } from '../types';

export function getProducts(page: number, size: number): Promise<ResponseArray<Product>> {
    return http.get(`/products?page=${page}&size=${size}`);
}

export function getProductsbyShop(shopId: string, page: number, size: number): Promise<ResponseArray<Product>> {
    return http.get(`/products?shopId=${shopId}&page=${page}&size=${size}`);
}

export function getProductsbyShopAndCategory(
    shopId: string,
    categoryId: number,
    page: number,
    size: number,
): Promise<ResponseArray<Product>> {
    return http.get(
        `/products?shopId=${shopId}&categoryId=${categoryId}&page=${page}&size=${size}`,
    );
}

export function getProduct(id: string): Promise<AxiosResponse<Product>> {
    return http.get(`/products/${id}`);
}

export function createProduct(product: MinimalProduct): Promise<AxiosResponse<Product>> {
    return http.post(`/products`, product);
}

export function editProduct(product: MinimalProduct): Promise<AxiosResponse<Product>> {
    return http.put(`/products`, product);
}

export function deleteProduct(id: string): Promise<AxiosResponse<Product>> {
    return http.delete(`/products/${id}`);
}
