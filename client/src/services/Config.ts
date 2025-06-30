import axios from 'axios';
import { useUserStore } from '../Store/UserStore';

const BASE_URL = import.meta.env.VITE_SPOTIFY_BASE_URL;
const TIME_OUT = 50000;

const axiosInstance = axios.create({
  xsrfCookieName: 'csrftoken', // Match Django setting
  xsrfHeaderName: 'HTTP_X_CSRFTOKEN',
  withCredentials: true,
  baseURL: BASE_URL,
  timeout: TIME_OUT,
});

axiosInstance.interceptors.request.use(async req => {
  try {
    const { user } = useUserStore.getState(); // Retrieve user object from Zustand
    if (user) {
      req.headers.Authorization = `Token ${user?.token}`;
    }
    return req;
  } catch (error) {
    return error;
  }
});

export default axiosInstance;
