"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getStoredUser, getToken, logout as apiLogout } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children, requireAuth = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const u = getStoredUser();
    const t = getToken();
    setUser(u);
    setToken(t);
    setReady(true);
  }, []);

  // Guard protected routes — redirect to /login if not authenticated.
  // We consider the user "authenticated" if we have either a stored user OR a token,
  // since some APIs return only one of them.
  useEffect(() => {
    if (!ready || !requireAuth) return;
    if (!user && !token) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/dashboard")}`);
    }
  }, [ready, requireAuth, user, token, router, pathname]);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    setToken(null);
    router.replace("/login");
  }, [router]);

  const refresh = useCallback(() => {
    setUser(getStoredUser());
    setToken(getToken());
  }, []);

  const value = {
    user,
    token,
    role: user?.role ?? "customer",
    isAdmin: user?.role === "admin",
    isAuthenticated: Boolean(user || token),
    ready,
    logout,
    refresh,
    setUser,
  };

  // While hydrating a protected route, render a minimal placeholder
  if (requireAuth && (!ready || !value.isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-white/50">
          <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
          Loading your workspace…
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Safe default when used outside the provider (e.g. during hydration)
    return {
      user: null,
      token: null,
      role: "customer",
      isAdmin: false,
      isAuthenticated: false,
      ready: false,
      logout: () => { },
      refresh: () => { },
      setUser: () => { },
    };
  }
  return ctx;
}
