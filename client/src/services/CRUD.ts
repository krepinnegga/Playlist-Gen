/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './Config';
import type { AxiosResponse } from 'axios';

// Error response type
interface ApiError {
  message: string;
  status?: number;
  data?: any;
  config?: any;
}

/**
 * GET request fetcher
 * @param url API endpoint
 * @returns Promise with response data
 */
export const serviceFetcher = async <T>(url: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.get(url);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
    console.error(`Error fetching from ${url}`, apiError);
    throw apiError;
  }
};

/**
 * POST request handler
 * @param url API endpoint
 * @param payload Request payload
 * @returns Promise with full response
 */
export const servicePoster = async <T, U>(
  url: string,
  payload: U
): Promise<AxiosResponse<T>> => {
  try {
    return await axiosInstance.post<T>(url, payload);
  } catch (error: any) {
    const apiError: ApiError = {
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
    console.error(`Error posting to ${url}`, apiError);
    throw apiError;
  }
};

/**
 * PUT request handler
 * @param url API endpoint
 * @param payload Request payload
 * @returns Promise with full response
 */
export const serviceUpdate = async <T, U>(
  url: string,
  payload: U
): Promise<AxiosResponse<T>> => {
  try {
    return await axiosInstance.put<T>(url, payload);
  } catch (error: any) {
    const apiError: ApiError = {
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
    console.error(`Error updating at ${url}`, apiError);
    throw apiError;
  }
};

/**
 * DELETE request handler
 * @param url API endpoint
 * @returns Promise with response data
 */
export const serviceDelete = async <T>(url: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.delete(url);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
    console.error(`Error deleting at ${url}`, apiError);
    throw apiError;
  }
};
