import service from './request';

interface ResType<T> {
  code?: number;
  data?: any;
  msg?: string;
  err?: string;
  pages?: any
}
interface Http {
  get<T>(url: string, params?: unknown): Promise<ResType<T>>;
  post<T>(url: string, params?: unknown): Promise<ResType<T>>;
  put<T>(url: string, params?: unknown): Promise<ResType<T>>;
  delete<T>(url: string, params?: unknown): Promise<ResType<T>>;
  upload<T>(url: string, params: unknown): Promise<ResType<T>>;
}

const http: Http = {
  get(url, params) {
    return new Promise((resolve, reject) => {
      service
        .get(url, { params })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  },
  post(url, params) {
    return new Promise((resolve, reject) => {
      service
        .post(url, JSON.stringify(params))
        .then((res) => resolve(res))
        .catch((err) => {
          reject(err);
        });
    });
  },
  put(url, params) {
    return new Promise((resolve, reject) => {
      service
        .put(url, JSON.stringify(params))
        .then((res) => resolve(res))
        .catch((err) => {
          reject(err);
        });
    });
  },
  delete(url) {
    return new Promise((resolve, reject) => {
      service
        .delete(url)
        .then((res) => resolve(res))
        .catch((err) => {
          reject(err);
        });
    });
  },
  upload: function <T>(url: string, params: unknown): Promise<ResType<T>> {
    throw new Error('Function not implemented.');
  }
}
export default http;
