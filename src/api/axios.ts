import axios, { AxiosRequestConfig } from "axios";
import { getToken, getRefreshToken, logout, login } from "../auth/auth";

import {getIndicadorOnlineAPI} from "./generated/api";


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
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      const {authControllerRefreshToken} = getIndicadorOnlineAPI()

      try {

        const { access_token, refresh_token } = authControllerRefreshToken({refreshToken: getRefreshToken()});

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
