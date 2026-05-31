import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { LanguageToggle } from "../shared/LanguageToggle";
import { ThemeToggle } from "../shared/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Menu, X, BookOpen, LayoutDashboard, LogOut, User,
  GraduationCap, Lightbulb, Award, Bot, Search, ArrowRight,
  Star, Zap, Info, Mail, DollarSign, Trophy,
} from "lucide-react";

const BRAND = "Albayaan.pro";

function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const { language } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  const { data: allCourses = [] } = useQuery<any[]>({
    queryKey: ["courses-search"],
    queryFn: async () => {
      const res = await fetch("/api/courses");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60_000,
  });

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const results = query.trim().length > 1
    ? allCourses.filter(c => {
        const q = query.toLowerCase();
        return (
          (c.title || "").toLowerCase().includes(q) ||
          (c.description || "").toLowerCase().includes(q) ||
          (c.language || "").toLowerCase().includes(q) ||
          (c.titleAr || "").includes(q) ||
          (c.titleSo || "").toLowerCase().includes(q)
        );
      }).slice(0, 6)
    : allCourses.slice(0, 6);

  const getTitle = (c: any) =>
    language === "ar" ? (c.titleAr || c.title) :
    language === "so" ? (c.titleSo || c.title) :
    c.title;

  const LEVEL_COLORS: Record<string, string> = {
    beginner:     "from-blue-500 to-cyan-600",
    intermediate: "from-purple-500 to-indigo-600",
    advanced:     "from-red-500 to-orange-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.2)]"
        style={{ background: "rgba(10,22,40,0.98)", border: "1px solid rgba(59,130,246,0.2)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search courses, topics, skills..."
            className="flex-1 bg-transparent text-white placeholder-muted-foreground text-base focus:outline-none"
            onKeyDown={e => {
              if (e.key === "Enter" && results.length > 0) {
                navigate(`/courses/${results[0].id}`);
                onClose();
              }
            }}
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="py-2 max-h-[400px] overflow-y-auto">
          {!query && allCourses.length > 0 && (
            <div className="px-4 pt-2 pb-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
                🔥 Available Courses
              </p>
            </div>
          )}
          {results.length === 0 && query && (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm">
              No courses found for "{query}"
            </div>
          )}
          {results.length === 0 && !query && (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm">
              No courses published yet
            </div>
          )}
          {results.map((course: any, i: number) => (
            <Link key={course.id} href={`/courses/${course.id}`} onClick={onClose}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${LEVEL_COLORS[course.level] ?? "from-blue-500 to-purple-600"} flex items-center justify-center shrink-0`}>
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
                    {getTitle(course)}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground capitalize">{course.language}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-xs text-muted-foreground capitalize">{course.level}</span>
                    {course.price > 0 && (
                      <>
                        <span className="text-muted-foreground/40">·</span>
                        <span className="text-xs font-bold text-primary">${course.price}</span>
                      </>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {results.length} course{results.length !== 1 ? "s" : ""} {query ? "found" : "available"}
          </span>
          <Link href="/courses" onClick={onClose} className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(v => !v); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const isActive = (path: string) => location === path || location.startsWith(path + "/");

  const mainLinks = [
    { href: "/curriculum",  label: t("School",   "المنهج",      "Manhajka"),     icon: GraduationCap },
    { href: "/courses",     label: t("Skills",   "المهارات",    "Xirfadaha"),    icon: Lightbulb },
    { href: "/ai-tutor",    label: t("AI Tutor", "المعلم الذكي","Bare AI-ga"),   icon: Bot, badge: true },
    { href: "/leaderboard", label: t("Ranks",    "التصنيفات",   "Qiimaynta"),    icon: Trophy },
    { href: "/about",       label: t("About",    "عنا",         "Naga"),         icon: Info },
    { href: "/pricing",     label: t("Pricing",  "الأسعار",     "Qiimaha"),      icon: DollarSign },
  ];

  const userLinks = user ? [
    { href: "/dashboard",       label: t("Dashboard",    "لوحة التحكم",     "Dhaq-dhaqaaqa"),     icon: LayoutDashboard },
    { href: "/my-certificates", label: t("Certificates", "شهاداتي",         "Shahaadooyinkayga"), icon: Award },
  ] : [];

  const allMobileLinks = [...mainLinks, ...userLinks];

  return (
    <>
      <AnimatePresence>
        {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50"
            : "bg-transparent"
        }`}
        style={{ transform: "translateZ(0)" }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative">
              <img src="/logo-48.png" alt={BRAND} className="h-9 w-9 object-contain"
                style={{ filter: "drop-shadow(0 0 8px rgba(59,130,246,0.6))" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {BRAND}
              </span>
              <span className="text-[9px] text-muted-foreground tracking-widest uppercase font-medium">
                AI Learning Platform
              </span>
            </div>
          </Link>

          {/* Desktop nav — center */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-0.5">
            {mainLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}>
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
                {link.badge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 border border-background animate-pulse" />
                )}
              </Link>
            ))}
            {userLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}>
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <button onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-full text-sm text-muted-foreground border border-white/10 hover:border-primary/30 hover:text-foreground hover:bg-white/5 transition-all">
              <Search className="w-4 h-4" />
              <kbd className="text-[10px] opacity-60">⌘K</kbd>
            </button>
            <LanguageToggle />
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-foreground">{user.name?.split(" ")[0]}</span>
                </Link>
                <button onClick={() => logout()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login"
                  className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {t("Login", "دخول", "Gal")}
                </Link>
                <Link href="/auth/register"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  {t("Sign Up", "إنشاء حساب", "Is Diiwaangeli")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile right */}
          <div className="flex lg:hidden items-center gap-2">
            <button onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <LanguageToggle compact />
            <ThemeToggle />
            <button onClick={() => setMobileOpen(v => !v)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              aria-label="Toggle menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-40 bg-background/98 backdrop-blur-xl border-b border-border shadow-xl max-h-[80vh] overflow-y-auto"
            style={{ transform: "translateZ(0)" }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {allMobileLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}>
                  <link.icon className="w-5 h-5" />
                  {link.label}
                  {(link as any).badge && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
                      <Zap className="w-3 h-3" /> AI
                    </span>
                  )}
                </Link>
              ))}

              <Link href="/contact"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                <Mail className="w-5 h-5" />
                {t("Contact", "تواصل", "Xiriir")}
              </Link>

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
                    <button onClick={() => logout()}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full">
                      <LogOut className="w-5 h-5" />
                      {t("Logout", "تسجيل الخروج", "Bixitaan")}
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/auth/login"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-white/5 transition-colors">
                      <User className="w-4 h-4" />
                      {t("Login", "دخول", "Gal")}
                    </Link>
                    <Link href="/auth/register"
                      className="flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold transition-all">
                      {t("Sign Up", "إنشاء حساب", "Is Diiwaangeli")}
                    </Link>
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
