import axios from 'axios';
import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { useUserStore } from '../store/index';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const TIME_OUT = 50000;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
});

interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Request interceptor
axiosInstance.interceptors.request.use(
  async (
    req: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    try {
      const { user } = useUserStore.getState();
      if (user?.accessToken) {
        req.headers.Authorization = `Bearer ${user.accessToken}`;
      }
      return req;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Add token refresh logic here if needed
        // const newToken = await refreshToken();
        // useUserStore.getState().setUserData({ accessToken: newToken });
        // return axiosInstance(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().clearUserData();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
