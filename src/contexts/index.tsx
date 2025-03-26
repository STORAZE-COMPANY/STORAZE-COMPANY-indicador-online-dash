import React from "react";
import { AuthProvider } from "./AuthContext";

interface AppProvider {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProvider) => {
  return <AuthProvider>{children}</AuthProvider>;
};
