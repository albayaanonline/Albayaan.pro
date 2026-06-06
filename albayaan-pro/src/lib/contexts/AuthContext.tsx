import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useGetMe, getGetMeQueryKey, User, setAuthTokenGetter } from "@/lib/api-client";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { signOutFromSupabase } from "@/lib/supabase";
import { resolveApiUrl, clearAdminToken } from "@/lib/adminFetch";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

setAuthTokenGetter(async () => {
  try {
    const stored = localStorage.getItem("albayaan_admin_token");
    if (stored) return stored;
  } catch {}
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: apiUser, isLoading: isQueryLoading } = useGetMe({
    query: { queryKey: getGetMeQueryKey(), retry: false },
  });

  const [localUser, setLocalUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isQueryLoading) {
      if (apiUser) {
        setLocalUser(apiUser);
      }
      setIsLoading(false);
    }
  }, [apiUser, isQueryLoading]);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !apiUser) {
        const sbUser = session.user;
        setLocalUser({
          id: 0,
          name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || sbUser.email?.split("@")[0] || "User",
          email: sbUser.email || "",
          role: "user",
        } as User);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const sbUser = session.user;
        setLocalUser({
          id: 0,
          name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || sbUser.email?.split("@")[0] || "User",
          email: sbUser.email || "",
          role: "user",
        } as User);
      } else if (_event === "SIGNED_OUT") {
        if (!apiUser) {
          setLocalUser(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [apiUser]);

  const login = (userData: User) => {
    setLocalUser(userData);
  };

  const logout = async () => {
    setLocalUser(null);
    clearAdminToken();
    await signOutFromSupabase();
    try {
      await fetch(resolveApiUrl("/api/auth/logout"), { method: "POST", credentials: "include" });
    } catch {}
  };

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

interface ProtectedRouteProps {
  component: React.ComponentType<Record<string, unknown>>;
  adminOnly?: boolean;
  [key: string]: unknown;
}

export function ProtectedRoute({ component: Component, adminOnly = false, ...rest }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !adminOnly && !user) {
      setLocation("/auth/login");
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

  if (!adminOnly && !user) {
    return null;
  }

  return <Component {...rest} />;
}
