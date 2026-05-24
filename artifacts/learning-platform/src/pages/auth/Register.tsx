import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { mutate, isPending } = useRegister({
    mutation: {
      onSuccess: (data: any) => {
        login(data);
        setLocation("/dashboard");
      },
      onError: (err: any) => {
        setError(err?.response?.data?.error || t("Registration failed. Please try again.", "فشل التسجيل. الرجاء المحاولة مرة أخرى.", "Diiwaan gelinta waa fashilantay. Fadlan isku day mar kale."));
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError(t("Password must be at least 6 characters", "يجب أن تكون كلمة المرور 6 أحرف على الأقل", "Furaha sir ah waa in uu ahaado ugu yaraan 6 xaraf"));
      return;
    }
    mutate({ data: { name, email, password } });
  };

  return (
    <div className="min-h-[100dvh] pt-16 flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[150px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4 my-8"
      >
        <div className="p-8 rounded-3xl bg-card border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 inline-block mb-2">
              IlmAI
            </Link>
            <h1 className="text-2xl font-bold text-white">{t("Create your account", "إنشاء حسابك", "Samee akoonkaaga")}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t("Start your learning journey today", "ابدأ رحلتك التعليمية اليوم", "Maanta bilow safarka waxbarashadaada")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t("Full Name", "الاسم الكامل", "Magaca Buuxa")}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                placeholder={t("Your full name", "اسمك الكامل", "Magacaaga buuxa")}
              />
            </div>

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
              <label className="block text-sm font-medium text-gray-300 mb-2">{t("Password", "كلمة المرور", "Furaha sir ah")}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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
              {t("Create Account", "إنشاء الحساب", "Samee Akoon")}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("Already have an account?", "لديك حساب بالفعل؟", "Ma haysataa akoon?")}
            {" "}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              {t("Sign in", "تسجيل الدخول", "Gal")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
