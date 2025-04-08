import axios, { AxiosRequestConfig } from "axios";
import { getToken, getRefreshToken, logout, login } from "../auth/auth";
import { getIndicadorOnlineAPI } from "./generated/api";

// Instância principal do Axios
const api = axios.create({
  baseURL: "http://localhost:3000", 
});


export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  return await api({ ...config, ...options }).then((res) => res.data);
};


api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refreshToken") &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        const { authControllerRefreshToken } = getIndicadorOnlineAPI();

        const { data } = await authControllerRefreshToken({
          refreshToken: getRefreshToken(),
        });

        const { access_token, refresh_token } = data;

      
        login({ access_token, refresh_token });

       
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        logout();
        window.location.href = "/login"; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;