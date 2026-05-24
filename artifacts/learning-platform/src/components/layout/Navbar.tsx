import { Link } from "wouter";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { ThemeToggle } from "../shared/ThemeToggle";
import { LanguageToggle } from "../shared/LanguageToggle";

export function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          IlmAI
        </Link>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden md:flex items-center gap-6 mr-4">
            <Link href="/courses" className="text-sm font-medium hover:text-primary transition-colors">
              {t("Courses", "الدورات", "Koorsooyinka")}
            </Link>
            {user && (
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                {t("Dashboard", "لوحة القيادة", "Dhaq-dhaqaaqa")}
              </Link>
            )}
            {user?.role === "admin" && (
              <Link href="/admin" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                Admin
              </Link>
            )}
          </div>
          <LanguageToggle />
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline-block">{user.name}</span>
              <button onClick={() => logout()} className="text-sm font-medium hover:text-destructive transition-colors">
                {t("Logout", "تسجيل الخروج", "Bixitaan")}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors px-3 py-2">
                {t("Login", "تسجيل الدخول", "Galitaan")}
              </Link>
              <Link href="/auth/register" className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full transition-colors">
                {t("Sign Up", "إنشاء حساب", "Is Diiwaangeli")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
