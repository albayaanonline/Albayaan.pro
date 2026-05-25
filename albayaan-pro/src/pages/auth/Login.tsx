import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useLogin } from "@/lib/api-client";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signInWithGoogle, isSupabaseConfigured } from "@/lib/supabase";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const { mutate, isPending } = useLogin({
    mutation: {
      onSuccess: (data: any) => {
        login(data);
        setLocation(data.role === "admin" ? "/admin" : "/dashboard");
      },
      onError: () => {
        setError(t("Invalid email or password", "البريد الإلكتروني أو كلمة المرور غير صحيحة", "Emailka ama furaha sir ah ma sax"));
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    mutate({ data: { email, password } });
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setGoogleLoading(false);
      setError(t("Google sign-in failed. Please try again.", "فشل تسجيل الدخول بجوجل.", "Google galitaanka waa fashilantay."));
    }
  };

  return (
    <div className="min-h-[100dvh] pt-16 flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="p-8 rounded-3xl bg-card border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 inline-block mb-2">
              Albayaan.pro
            </Link>
            <h1 className="text-2xl font-bold text-white">{t("Welcome back", "مرحباً بعودتك", "Ku soo dhawoow")}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t("Sign in to continue learning", "سجل دخولك لمواصلة التعلم", "Gal si aad waxbarasho ugu sii wadato")}</p>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || !isSupabaseConfigured}
            className="w-full mb-6 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-sm flex items-center justify-center gap-3 transition-all hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {t("Continue with Google", "المتابعة باستخدام جوجل", "Ku sii wad Google")}
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-muted-foreground">{t("or sign in with email", "أو تسجيل الدخول بالبريد الإلكتروني", "ama gal email")}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t("Email", "البريد الإلكتروني", "Emailka")}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">{t("Password", "كلمة المرور", "Furaha sir ah")}</label>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  {t("Forgot password?", "نسيت كلمة المرور؟", "Ma ilowday furaha?")}
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("Sign In", "تسجيل الدخول", "Gal")}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("Don't have an account?", "ليس لديك حساب؟", "Ma lihin akoon?")}
            {" "}
            <Link href="/auth/register" className="text-primary font-medium hover:underline">
              {t("Sign up free", "إنشاء حساب مجاناً", "Bilaash is diiwaangeli")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
