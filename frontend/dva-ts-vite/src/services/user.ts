import { PageBody, PageRequest } from './index';
import { request } from '../utils/HttpClient';

const base = '/app';

export interface UserInfo {
  username?: string;
  mobile?: string;
  gender?: number;
  id?: string;
}

export interface UserListRequest extends PageRequest {
  searchTxt?: string;
}

export async function login(data: { username: string; password: string }) {
  return request(`${base}/oauth/login`, {
    method: 'POST',
    data,
  });
}

export async function logout() {
  return request(`${base}/oauth/logout`);
}

export async function queryUserList(params: UserListRequest) {
  return request<PageBody<UserInfo>>(`${base}/user`, {
    method: 'GET',
    params,
  });
}

export async function getUserInfo(id: string) {
  return request<UserInfo>(`${base}/user/${id}`, {
    method: 'GET',
  });
}

