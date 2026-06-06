import { useState, useEffect, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  LayoutDashboard, Users, CreditCard, Key, LogOut, Menu, X,
  ExternalLink, BookOpen, BarChart2, Shield, ChevronRight, Settings, Upload, Award, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = "Albayaan.pro";

const NAV_ITEMS = [
  { href: "/management-portal",              icon: LayoutDashboard, label: "Overview",      color: "text-blue-400" },
  { href: "/management-portal/courses",      icon: BookOpen,        label: "Courses",       color: "text-purple-400" },
  { href: "/management-portal/content",      icon: Upload,          label: "Content",       color: "text-blue-300" },
  { href: "/management-portal/users",        icon: Users,           label: "Users",         color: "text-green-400" },
  { href: "/management-portal/payments",     icon: CreditCard,      label: "Payments",      color: "text-yellow-400" },
  { href: "/management-portal/codes",        icon: Key,             label: "Access Codes",  color: "text-cyan-400" },
  { href: "/management-portal/analytics",    icon: BarChart2,       label: "Analytics",     color: "text-pink-400" },
  { href: "/management-portal/certificates", icon: Award,           label: "Certificates",  color: "text-orange-400" },
  { href: "/management-portal/settings",     icon: Settings,        label: "Settings",      color: "text-gray-400" },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = async () => { await logout(); };

  return (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="px-5 py-5 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo-48.png" alt="Albayaan.pro" className="h-8 w-8 object-contain" />
          <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {BRAND}
          </span>
        </Link>
        <div className="flex items-center gap-1.5 mt-1">
          <Shield className="w-3 h-3 text-purple-400" />
          <span className="text-xs text-muted-foreground font-medium">Admin Panel</span>
          <Link href="/" className="text-primary hover:underline ml-auto inline-flex items-center gap-0.5 text-xs" onClick={onClose}>
            <ExternalLink className="w-3 h-3" /> Site
          </Link>
        </div>
      </div>

      {/* User info */}
      {user && (
        <div className="px-5 py-3 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">{user.name || "Admin"}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium group ${
                isActive
                  ? "bg-primary text-white shadow-[0_0_12px_rgba(59,130,246,0.25)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : item.color}`} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-border/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      setLocation("/management-portal/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl animate-pulse" />
            <div className="relative w-14 h-14 rounded-2xl bg-card border border-white/10 flex items-center justify-center">
              <img src="/logo-96.png" alt="Albayaan.pro" className="w-8 h-8 object-contain" />
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

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 bg-card border-r border-border flex-col fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-background/95 backdrop-blur-md border-b border-border">
        <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          {BRAND} Admin
        </span>
        <button
          onClick={() => setMobileSidebarOpen(v => !v)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-30 bg-black/60"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="md:hidden fixed left-0 top-14 bottom-0 w-56 bg-card border-r border-border z-40"
            >
              <SidebarContent onClose={() => setMobileSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-56 pt-14 md:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
