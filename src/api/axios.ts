import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getToken, getRefreshToken, login, logout } from '../auth/auth';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000', 
});

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
      !originalRequest.url.includes('/auth/refreshToken') &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post('/auth/refreshToken', {
          refreshToken: getRefreshToken(),
        });

        const { access_token, refresh_token } = refreshResponse.data;

        login({ access_token, refresh_token });

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.log("refreshError", refreshError)
      /*   logout();
        window.location.href = '/login'; */
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// função usada pelo Orval como `mutator`
export const customInstance = <T = unknown>(
  config: AxiosRequestConfig
): Promise<T> => {
  return api(config).then((res) => res.data);
};

export default api;