import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useLogin } from "@/lib/api-client";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Eye, EyeOff, Loader2, GraduationCap, Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { mutate, isPending } = useLogin({
    mutation: {
      onSuccess: (data: any) => {
        login(data);
        setLocation(data.role === "admin" ? "/admin" : "/dashboard");
      },
      onError: (err: any) => {
        setError(
          err?.response?.data?.error ||
          t("Invalid email or password. Please try again.", "البريد الإلكتروني أو كلمة المرور غير صحيحة.", "Emailka ama furaha sir ah ma sax.")
        );
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError(t("Please enter your email address.", "الرجاء إدخال بريدك الإلكتروني.", "Fadlan gali emailkaaga."));
      return;
    }
    if (!password) {
      setError(t("Please enter your password.", "الرجاء إدخال كلمة المرور.", "Fadlan gali furaha sir ahaa."));
      return;
    }
    mutate({ data: { email: email.trim(), password } });
  };

  return (
    <div className="min-h-[100dvh] pt-16 flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/12 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="p-8 sm:p-10 rounded-3xl bg-card border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center gap-3 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <img
                  src="/logo-96.png"
                  alt="Al-Bayaan College"
                  className="relative h-16 w-16 object-contain drop-shadow-[0_0_16px_rgba(59,130,246,0.7)]"
                />
              </div>
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Albayaan.pro
              </span>
            </Link>
            <h1 className="text-2xl font-black text-white">
              {t("Welcome back", "مرحباً بعودتك", "Ku soo dhawoow")}
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              {t("Sign in to continue your learning journey", "سجل دخولك لمواصلة رحلتك التعليمية", "Gal si aad waxbarasho ugu sii wadato")}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t("Email Address", "البريد الإلكتروني", "Ciwaanka Emailka")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 transition-all text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-300">
                  {t("Password", "كلمة المرور", "Furaha sir ah")}
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  {t("Forgot password?", "نسيت كلمة المرور؟", "Ma ilowday furaha?")}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 transition-all text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl"
              >
                <span className="shrink-0 mt-0.5">⚠</span>
                <span>{error}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isPending}
              whileHover={{ scale: isPending ? 1 : 1.02 }}
              whileTap={{ scale: isPending ? 1 : 0.98 }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all disabled:opacity-60 flex items-center justify-center gap-2.5 mt-2"
            >
              {isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {t("Signing in…", "جارٍ تسجيل الدخول…", "Gelaya…")}</>
              ) : (
                <><GraduationCap className="w-5 h-5" /> {t("Sign In", "تسجيل الدخول", "Gal")} <ArrowRight className="w-4 h-4 ml-1" /></>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-muted-foreground px-2">Al-Bayaan College</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-foreground">
            {t("Don't have an account?", "ليس لديك حساب؟", "Ma lihin akoon?")}{" "}
            <Link href="/auth/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              {t("Create account free", "إنشاء حساب مجاناً", "Bilaash samee akoon")}
            </Link>
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">🔒 {t("Secure", "آمن", "Ammaan")}</span>
            <span>·</span>
            <span className="flex items-center gap-1">📚 {t("3 Languages", "3 لغات", "3 Luqadood")}</span>
            <span>·</span>
            <span className="flex items-center gap-1">🎓 {t("Certified", "معتمد", "Shahaado")}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
