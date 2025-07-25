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

    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        useUserStore.getState().setUserData({
          accessToken: newToken.accessToken,
          expiresIn: newToken.expiresIn,
        });
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().clearUserData();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Refresh the access token using the refresh token stored in the user store.
 * Updates the user store with the new access token and expiry.
 */
export const refreshToken = async () => {
  const { user, setUserData, clearUserData } = useUserStore.getState();
  if (!user?.refreshToken) throw new Error('No refresh token available');
  try {
    const response = await axiosInstance.post('/api/auth/refresh', {
      refreshToken: user.refreshToken,
    });
    setUserData({
      accessToken: response.data.accessToken,
      expiresIn: response.data.expiresIn,
    });
    return response.data;
  } catch (error) {
    clearUserData();
    throw error;
  }
};

export default axiosInstance;
