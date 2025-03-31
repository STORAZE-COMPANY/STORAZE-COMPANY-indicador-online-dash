import axios, { AxiosRequestConfig } from "axios";

 const api = axios.create({
  baseURL: "http://localhost:3000", 
});
export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return await api({ ...config, ...options }).then((res) => res.data)
}

// Interceptador opcional para adicionar token automaticamente nas requisições futuras
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
