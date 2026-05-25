import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { LanguageToggle } from "../shared/LanguageToggle";
import { ThemeToggle } from "../shared/ThemeToggle";
import { Menu, X, BookOpen, LayoutDashboard, ShieldCheck, LogOut, User, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = "Albayaan.pro";

export function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const isActive = (path: string) => location === path;

  const navLinks = [
    { href: "/courses", label: t("Courses", "الدورات", "Koorsooyinka"), icon: BookOpen },
    { href: "/pricing", label: t("Pricing", "الأسعار", "Qiimaha"),     icon: DollarSign },
    ...(user ? [{ href: "/dashboard", label: t("Dashboard", "لوحة التحكم", "Dhaq-dhaqaaqa"), icon: LayoutDashboard }] : []),
    ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin", icon: ShieldCheck }] : []),
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {BRAND}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                } ${link.href === "/admin" ? "text-purple-400 hover:text-purple-300 hover:bg-purple-500/10" : ""}`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-foreground">{user.name?.split(" ")[0]}</span>
                </div>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  {t("Logout", "خروج", "Bax")}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/admin/login" className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </Link>
                <Link href="/auth/login" className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {t("Login", "دخول", "Gal")}
                </Link>
                <Link href="/auth/register" className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold hover:opacity-90 transition-opacity">
                  {t("Sign Up", "إنشاء حساب", "Is Diiwaangeli")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageToggle compact />
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-background/98 backdrop-blur-xl border-b border-border shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-border/50 space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => logout()}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      {t("Logout", "تسجيل الخروج", "Bixitaan")}
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link href="/admin/login" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-purple-400 hover:bg-purple-500/10 transition-colors">
                      <ShieldCheck className="w-4 h-4" /> Admin Login
                    </Link>
                    <div className="grid grid-cols-2 gap-2">
                      <Link href="/auth/login" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-white/5 transition-colors">
                        <User className="w-4 h-4" />
                        {t("Login", "دخول", "Gal")}
                      </Link>
                      <Link href="/auth/register" className="flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold transition-all">
                        {t("Sign Up", "إنشاء حساب", "Is Diiwaangeli")}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
