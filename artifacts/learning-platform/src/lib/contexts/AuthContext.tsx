import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { setAuthTokenGetter } from "@/lib/api-client";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  supabaseId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  loginAsAdmin: (user: AuthUser) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function syncWithBackend(accessToken: string): Promise<AuthUser | null> {
  try {
    const res = await fetch("/api/auth/session-from-supabase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      id: data.id,
      name: data.name || data.email?.split("@")[0] || "User",
      email: data.email,
      role: data.role as "user" | "admin",
      supabaseId: data.supabaseId,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      setAuthTokenGetter(null);
      return;
    }

    setAuthTokenGetter(async () => {
      try {
        const { data } = await supabase!.auth.getSession();
        return data.session?.access_token ?? null;
      } catch {
        return null;
      }
    });

    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
        if (session.access_token) {
          const dbUser = await syncWithBackend(session.access_token);
          if (mounted) setUser(dbUser);
        }
        if (mounted) setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = (userData: AuthUser) => setUser(userData);

  const loginAsAdmin = (userData: AuthUser) => {
    setUser({ ...userData, role: "admin" });
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  };

  const refreshUser = async () => {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      const dbUser = await syncWithBackend(session.access_token);
      setUser(dbUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginAsAdmin, logout, refreshUser }}>
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

function LoadingScreen() {
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

export function ProtectedRoute({ component: Component, adminOnly = false, ...rest }: any) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setLocation(adminOnly ? "/admin/login" : "/auth/login");
      } else if (adminOnly && user.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the admin area.",
          variant: "destructive",
        });
        setLocation("/");
      }
    }
  }, [user, isLoading, setLocation, adminOnly]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user || (adminOnly && user.role !== "admin")) {
    return null;
  }

  return <Component {...rest} />;
}
