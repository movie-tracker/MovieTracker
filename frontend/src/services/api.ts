import ApiConfig from "@/config";
import axios from "axios";

export const httpClient = axios.create({
  baseURL: ApiConfig.apiUrl,
});

const apiClient = httpClient.create();
apiClient.interceptors.request.use((config) => {
  const newConfig = {
    ...config,
  };

  const token = localStorage.getItem("authToken");
  if (token) {
    newConfig.headers.Authorization = `Bearer ${token}`;
  }

  return newConfig;
});

export default apiClient;
