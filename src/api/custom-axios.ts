import axios from "axios";
import { getToken, getRefreshToken, login, logout } from "../auth/auth";

const instance = axios.create({
  baseURL: "http://localhost:3000", 
});

instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          "http://localhost:3000/auth/refreshToken",
          {
            refreshToken: getRefreshToken(),
          }
        );

        const { access_token, refresh_token } = response.data;
        login({ access_token, refresh_token });

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return instance(originalRequest);
      } catch (refreshError) {
        logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
