import { createContext, useContext, useState, useEffect } from "react";
import {
  isAuthenticated as checkAuth,
  login as storeToken,
  logout as removeToken,
} from "../auth/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(checkAuth());
  const [dataAuth, setDataAuth] = useState(() => {
    const saved = localStorage.getItem("dataAuth");
    return saved ? JSON.parse(saved) : {};
  });

  const login = ({ access_token, refresh_token, ...rest }) => {
    storeToken({ access_token, refresh_token });
    localStorage.setItem("dataAuth", JSON.stringify(rest)); 
    setAuth(true);
    setDataAuth(rest);
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem("dataAuth");
    setAuth(false);
    setDataAuth({});
  };

  useEffect(() => {
    setAuth(checkAuth());
    const saved = localStorage.getItem("dataAuth");
    if (saved) setDataAuth(JSON.parse(saved));
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, dataAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);