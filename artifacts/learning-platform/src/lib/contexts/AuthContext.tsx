import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useGetMe, User } from "@/lib/api-client";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading: isQueryLoading } = useGetMe({
    query: {
      retry: false,
    }
  });

  const [localUser, setLocalUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isQueryLoading) {
      setLocalUser(user || null);
      setIsLoading(false);
    }
  }, [user, isQueryLoading]);

  const login = (userData: User) => setLocalUser(userData);
  const logout = () => setLocalUser(null);

  return (
    <AuthContext.Provider value={{ user: localUser, isLoading, login, logout }}>
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
        setLocation("/auth/login");
      } else if (adminOnly && user.role !== "admin") {
        setLocation("/dashboard");
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
