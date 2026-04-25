import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@liftivity/shared-types";
import { apiFetch, setStoredToken, clearStoredToken, getStoredToken } from "../lib/api";

interface AuthCtx {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthCtx = createContext<AuthCtx>(null as unknown as AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: validate any stored access token against the server
  useEffect(() => {
    if (!getStoredToken()) {
      setIsLoading(false);
      return;
    }
    apiFetch<{ user: User }>("/auth/me")
      .then(({ user: u }) => setUser(u))
      .catch(() => clearStoredToken())
      .finally(() => setIsLoading(false));
  }, []);

  // Global logout signal emitted by apiFetch when the refresh token also expires
  useEffect(() => {
    const onForcedLogout = () => setUser(null);
    window.addEventListener("auth:logout", onForcedLogout);
    return () => window.removeEventListener("auth:logout", onForcedLogout);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const res = await apiFetch<{ accessToken: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.accessToken);
    setUser(res.user);
  };

  const register = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<void> => {
    const res = await apiFetch<{ accessToken: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, displayName }),
    });
    setStoredToken(res.accessToken);
    setUser(res.user);
  };

  const logout = async (): Promise<void> => {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    clearStoredToken();
    setUser(null);
  };

  return (
    <AuthCtx.Provider
      value={{ user, isAuthenticated: user !== null, isLoading, login, register, logout }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = (): AuthCtx => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
