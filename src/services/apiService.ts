import { AxiosHeaders, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import api from '../api/axios';
import localStorageService from './localStorageService';
import { AuthResponse } from '../models/auth/auth.response';
import router from '../router'

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const authData = localStorageService.get<AuthResponse>('auth-data');

    if (authData?.token) {
        if (!config.headers || !(config.headers instanceof AxiosHeaders)) {
            config.headers = new AxiosHeaders(config.headers);
        }

        config.headers.set('Authorization', `${authData.type} ${authData.token}`);
    }

    return config;
}, error => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorageService.remove('auth-data');
            router.push('/login');
        }

        return Promise.reject(error);
    }
);


function get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return api.get<T>(url, config);
}

function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return api.post<T>(url, data, config);
}

function put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return api.put<T>(url, data, config);
}

function del<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return api.delete<T>(url, config);
}

export const apiService = {
    get,
    post,
    put,
    delete: del,
};
