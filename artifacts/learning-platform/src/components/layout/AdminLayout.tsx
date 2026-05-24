import { useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/contexts/AuthContext";
import { LayoutDashboard, Users, CreditCard, Key, LogOut, Menu, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Overview" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/payments", icon: CreditCard, label: "Payments" },
    { href: "/admin/codes", icon: Key, label: "Access Codes" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-5">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/" className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 inline-block">
          IlmAI
        </Link>
        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
          Admin Panel
          <Link href="/" className="text-primary hover:underline ml-1 inline-flex items-center gap-0.5">
            <ExternalLink className="w-3 h-3" /> Site
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={() => logout()}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors mt-auto"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 bg-card border-r border-border flex-col fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-background/95 backdrop-blur-md border-b border-border">
        <Link href="/" className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          IlmAI Admin
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(v => !v)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
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
              className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden fixed left-0 top-14 bottom-0 w-60 bg-card border-r border-border z-40"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 md:ml-60 pt-14 md:pt-0">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
