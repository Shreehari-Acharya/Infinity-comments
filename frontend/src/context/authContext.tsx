"use client";

import { access } from "fs";
import { createContext, useContext, useState } from "react";

type AuthContextType = {
  token: string | null;
  setToken: (token: string) => void;
  getToken: () => string | null;  
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [tokenState, setTokenState] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const setToken = async (token: string) => {
    setAccessToken(token);
    setTokenState(token);
  };

  const getToken = () => {
    return accessToken;
  };
  
  const logout = () => {
    setAccessToken(null);
    setTokenState(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ token: tokenState, setToken, getToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

