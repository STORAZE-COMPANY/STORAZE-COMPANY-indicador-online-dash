export const login = ({ access_token, refresh_token }) => {
  localStorage.setItem("token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};
