import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { LanguageToggle } from "../shared/LanguageToggle";
import { ThemeToggle } from "../shared/ThemeToggle";
import { Menu, X, BookOpen, LayoutDashboard, LogOut, User, GraduationCap, Lightbulb } from "lucide-react";

const BRAND = "Al-Bayaan College";

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

  const isActive = (path: string) => location === path || location.startsWith(path + "/");

  const navLinks = [
    { href: "/curriculum", label: t("Curriculum", "المنهج الدراسي", "Manhajka"), icon: GraduationCap },
    { href: "/courses", label: t("Skills", "المهارات", "Xirfadaha"), icon: Lightbulb },
    ...(user ? [{ href: "/dashboard", label: t("Dashboard", "لوحة التحكم", "Dhaq-dhaqaaqa"), icon: LayoutDashboard }] : []),
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50"
            : "bg-transparent"
        }`}
        style={{ transform: "translateZ(0)" }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative">
              <img src="/logo-48.png" alt="Al-Bayaan College" className="h-9 w-9 object-contain" style={{ filter: "drop-shadow(0 0 8px rgba(59,130,246,0.6))" }} />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {BRAND}
              </span>
              <span className="text-[9px] text-muted-foreground tracking-widest uppercase font-medium">Learning Platform</span>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

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
                <Link href="/auth/login" className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {t("Login", "دخول", "Gal")}
                </Link>
                <Link href="/auth/register" className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  {t("Sign Up", "إنشاء حساب", "Is Diiwaangeli")}
                </Link>
              </div>
            )}
          </div>

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

      {mobileOpen && (
        <div
          className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-border shadow-xl"
          style={{ transform: "translateZ(0)" }}
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
        </div>
      )}
    </>
  );
}
