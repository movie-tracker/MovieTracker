import ApiConfig from '@/config';
import { IApiError } from '@/utils/errors';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const httpClient = axios.create({
  baseURL: ApiConfig.apiUrl,
});

const apiClient = httpClient.create();

function setAuthToken(config: InternalAxiosRequestConfig) {
  const newConfig: InternalAxiosRequestConfig = {
    ...config,
  };

  const token = localStorage.getItem('authToken');
  if (token) {
    newConfig.headers.Authorization = `Bearer ${token}`;
  }

  return newConfig;
}

function handleApiError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    throw error;
  }

  const axiosError = error as AxiosError;
  if (axiosError.code === 'ERR_NETWORK' || !axiosError.response?.data) {
    throw axiosError;
  }

  const body = axiosError.response.data as { error?: IApiError };
  if (!body.error) {
    throw axiosError;
  }

  const apiError = body.error;
  apiError.name = 'API_ERROR';

  throw apiError;
}

httpClient.interceptors.response.use(undefined, handleApiError);
apiClient.interceptors.request.use(setAuthToken);

export default apiClient;
