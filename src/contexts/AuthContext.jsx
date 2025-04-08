import { createContext, useContext, useState, useEffect } from "react";
import {
  isAuthenticated as checkAuth,
  login as storeToken,
  logout as removeToken,
} from "../auth/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(checkAuth());

  const login = ({ access_token, refresh_token }) => {
    storeToken({ access_token, refresh_token });
    setAuth(true);
  };

  const logout = () => {
    removeToken();
    setAuth(false);
  };

  useEffect(() => {
    setAuth(checkAuth());
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
