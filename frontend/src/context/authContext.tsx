"use client";

import { createContext, useContext, useState } from "react";

type AuthContextType = {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let _inMemoryToken: string | null = null;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [tokenState, setTokenState] = useState<string | null>(null);

  const setToken = async (token: string) => {
    _inMemoryToken = token;
    setTokenState(token);
  };


  const logout = () => {
    _inMemoryToken = null;
    setTokenState(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ token: tokenState, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const getAccessToken = () => _inMemoryToken;
export const clearAccessToken = () => (_inMemoryToken = null);
export const setAccessToken = (token: string) => (_inMemoryToken = token);
