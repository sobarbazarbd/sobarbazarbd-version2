"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_BASE, AUTH_API_BASE, endpoints, type User } from "@/lib/api";

type RegisterData = {
  username: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  shipping_address?: string;
  gender?: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean }>;
  resetPasswordConfirm: (uid: string, token: string, password: string) => Promise<{ success: boolean }>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${AUTH_API_BASE}${endpoints.authMe}`, {
        headers: { Authorization: `JWT ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setUser(json?.data ?? json);
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${AUTH_API_BASE}${endpoints.authJwtCreate}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || err.message || "Login failed");
      }

      const data = await res.json();
      const access = data?.data?.access ?? data?.access;
      const refresh = data?.data?.refresh ?? data?.refresh;

      if (access) localStorage.setItem("access_token", access);
      if (refresh) localStorage.setItem("refresh_token", refresh);

      await checkAuth();
      toast.success("Welcome back!");
      router.push("/account");
      return { success: true };
    } catch (err: any) {
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // Custom backend endpoint: creates the User AND the Customer profile
      // (name/phone/address) in one call — Djoser's /auth/users/ only creates the User.
      const res = await fetch(`${API_BASE}${endpoints.customerRegister}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err.error || Object.values(err).flat().join(", ") || "Registration failed";
        throw new Error(msg);
      }

      toast.success("Account created! Please log in.");
      router.push("/login");
      return { success: true };
    } catch (err: any) {
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    toast.success("Logged out");
    router.push("/login");
  };

  const resetPassword = async (email: string) => {
    try {
      const res = await fetch(`${AUTH_API_BASE}${endpoints.authResetPassword}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to send reset email");
      toast.success("Password reset email sent");
      return { success: true };
    } catch (err: any) {
      toast.error(err.message);
      return { success: false };
    }
  };

  const resetPasswordConfirm = async (uid: string, token: string, password: string) => {
    try {
      const res = await fetch(`${AUTH_API_BASE}${endpoints.authResetPasswordConfirm}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, token, new_password: password, re_new_password: password }),
      });
      if (!res.ok) throw new Error("Failed to reset password");
      toast.success("Password reset. Please log in.");
      router.push("/login");
      return { success: true };
    } catch (err: any) {
      toast.error(err.message);
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        resetPassword,
        resetPasswordConfirm,
        refresh: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
