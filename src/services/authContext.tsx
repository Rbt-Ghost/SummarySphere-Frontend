/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from "react";

import type { AuthSession, LoginRequest, SignupRequest } from "../types/auth";
import { authApi } from "./authApi";
import { authStorage } from "./authStorage";

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  login: (body: LoginRequest) => Promise<void>;
  signup: (body: SignupRequest) => Promise<{ autoLoggedIn: boolean }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(() => authStorage.get());

  const login = async (body: LoginRequest) => {
    const next = await authApi.login(body);
    setSession(next);
    authStorage.set(next);
  };

  const signup = async (body: SignupRequest) => {
    const created = await authApi.signup(body);
    if (created) {
      setSession(created);
      authStorage.set(created);
      return { autoLoggedIn: true };
    }
    return { autoLoggedIn: false };
  };

  const logout = () => {
    setSession(null);
    authStorage.clear();
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session?.token),
      login,
      signup,
      logout,
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
