import { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';

import { ApiResponse } from '../services';

/** 重新定义了 ApiResponseType，在当前文件使用，方便替换 ApiResponse */
type ApiResponseType<T = any> = ApiResponse<T>;

export const REQUEST_SUCCESS = '0';

const baseConfig: AxiosRequestConfig = {
  baseURL: '/api',
  timeout: 10 * 60_000,
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
};

export default class HttpClient {
  instance: AxiosInstance;

  constructor(config: AxiosRequestConfig = {}) {
    const axiosInstance = axios.create({ ...baseConfig, ...config });

    this.instance = axiosInstance;
  }

  public request<R = any>(config: AxiosRequestConfig): Promise<ApiResponseType<R>> {
    return this.instance.request(config);
  }

  public get<R = any>(url: string, params: any = {}, config: AxiosRequestConfig = {}): Promise<ApiResponseType<R>> {
    return this.request({ method: 'GET', url, params, ...config });
  }

  public post<R = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<ApiResponseType<R>> {
    return this.request({ method: 'POST', url, data, ...config });
  }

  public put<R = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<ApiResponseType<R>> {
    return this.request({ method: 'PUT', url, data, ...config });
  }

  public delete<R = any>(url: string, config: AxiosRequestConfig = {}): Promise<ApiResponseType<R>> {
    return this.request({ method: 'DELETE', url, ...config });
  }
}

export const httpClient = new HttpClient();

export function request<R = any>(
  url: string,
  config: AxiosRequestConfig = { method: 'GET' },
): Promise<ApiResponseType<R>> {
  config.url = url;
  return httpClient.request(config);
}
