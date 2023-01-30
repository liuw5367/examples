export interface ApiResponse<T = any> {
  success?: boolean;
  code: string | number;
  mesg?: string;
  time?: string;
  data: T;
}

export interface PageRequest {
  currentPage: number;
  pageSize: number;
}

export interface PageBody<T = any> {
  current: number;
  total: number;
  size: number;

  data: T[];
}
