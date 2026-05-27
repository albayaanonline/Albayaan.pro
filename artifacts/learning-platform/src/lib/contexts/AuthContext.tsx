import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useGetMe, User } from "@/lib/api-client";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

const ADMIN_STORAGE_KEY = "albayaan_admin_user";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  loginAsAdmin: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: apiUser, isLoading: isQueryLoading } = useGetMe({
    query: { retry: false, queryKey: ["me"] }
  });

  const [localUser, setLocalUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isQueryLoading) {
      if (apiUser) {
        setLocalUser(apiUser as User);
      }
      setIsLoading(false);
    }
  }, [apiUser, isQueryLoading]);

  const login = (userData: User) => {
    setLocalUser(userData);
  };

  const loginAsAdmin = (userData: User) => {
    const admin = { ...userData, role: "admin" as const };
    setLocalUser(admin);
    try { localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin)); } catch {}
  };

  const logout = async () => {
    setLocalUser(null);
    try { localStorage.removeItem(ADMIN_STORAGE_KEY); } catch {}
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user: localUser, isLoading, login, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function ProtectedRoute({ component: Component, adminOnly = false, ...rest }: any) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setLocation(adminOnly ? "/admin/login" : "/auth/login");
      } else if (adminOnly && user.role !== "admin") {
        setLocation("/admin/login");
      }
    }
  }, [user, isLoading, setLocation, adminOnly]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl animate-pulse" />
            <div className="relative w-14 h-14 rounded-2xl bg-card border border-white/10 flex items-center justify-center">
              <img src="/logo-96.png" alt="Al-Bayaan" className="w-8 h-8 object-contain" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p className="text-sm">Loading…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || (adminOnly && user.role !== "admin")) {
    return null;
  }

  return <Component {...rest} />;
}
