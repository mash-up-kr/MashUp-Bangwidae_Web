import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
import Cookies from 'js-cookie';
import { HTTP_METHODS } from '@/src/consts';

const axiosInstance: AxiosInstance = axios.create({
  timeout: 10000,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
  baseURL: 'https://doridori.ga/api/v1',
});

const accessToken = Cookies.get('accessToken') || '';
const accessTokenForTest = `Bearer ${process.env.NEXT_PUBLIC_MOCK_TOKEN}`;

const createApiMethod =
  (_axiosInstance: AxiosInstance, methodType: Method) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (config: AxiosRequestConfig): Promise<any> => {
    _axiosInstance.interceptors.response.use((response) => {
      if (!response?.data) {
        return response;
      }

      if (response.data.error) {
        return response.data;
      }

      return response.data.data;
    });

    return _axiosInstance({
      ...config,
      method: methodType,
      headers: {
        Authorization: accessToken || accessTokenForTest,
      },
    });
  };

export default {
  get: createApiMethod(axiosInstance, HTTP_METHODS.GET),
  post: createApiMethod(axiosInstance, HTTP_METHODS.POST),
  patch: createApiMethod(axiosInstance, HTTP_METHODS.PATCH),
  put: createApiMethod(axiosInstance, HTTP_METHODS.PUT),
  delete: createApiMethod(axiosInstance, HTTP_METHODS.DELETE),
};
