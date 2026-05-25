import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useGetMe, getGetMeQueryKey, User } from "@/lib/api-client";
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
    query: { queryKey: getGetMeQueryKey(), retry: false },
  });

  const [localUser, setLocalUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch { return null; }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isQueryLoading) {
      if (apiUser) {
        setLocalUser(apiUser);
      } else if (!localUser) {
        setLocalUser(null);
      }
      setIsLoading(false);
    }
  }, [apiUser, isQueryLoading]);

  const login = (userData: User) => {
    setLocalUser(userData);
  };

  const loginAsAdmin = (userData: User) => {
    const admin: User = { ...userData, role: "admin" as const };
    setLocalUser(admin);
    try { localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin)); } catch {}
  };

  const logout = () => {
    setLocalUser(null);
    try { localStorage.removeItem(ADMIN_STORAGE_KEY); } catch {}
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

interface ProtectedRouteProps {
  component: React.ComponentType<Record<string, unknown>>;
  adminOnly?: boolean;
  [key: string]: unknown;
}

export function ProtectedRoute({ component: Component, adminOnly = false, ...rest }: ProtectedRouteProps) {
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
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (adminOnly && user.role !== "admin")) {
    return null;
  }

  return <Component {...rest} />;
}
