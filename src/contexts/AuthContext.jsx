import { createContext, useContext, useState, useEffect } from "react";
import {
  isAuthenticated as checkAuth,
  login as storeToken,
  logout as removeToken,
} from "../auth/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(checkAuth());
  const [dataAuth, setDataAuth] = useState({});

  const login = ({ access_token, refresh_token, ...rest }) => {
    storeToken({ access_token, refresh_token });
    setAuth(true);
    setDataAuth(rest);
  };

  const logout = () => {
    removeToken();
    setAuth(false);
  };

  useEffect(() => {
    setAuth(checkAuth());
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, dataAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
