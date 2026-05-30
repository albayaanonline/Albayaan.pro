import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Eye, EyeOff, Loader2, User, Mail, Lock, CheckCircle, ArrowRight } from "lucide-react";

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { score, label: "Fair", color: "bg-orange-400" };
  if (score === 3) return { score, label: "Good", color: "bg-yellow-400" };
  if (score === 4) return { score, label: "Strong", color: "bg-green-400" };
  return { score, label: "Very Strong", color: "bg-green-500" };
}

export default function Register() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordsMatch = confirmPassword && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError(t("Please enter your full name.", "الرجاء إدخال اسمك الكامل.", "Fadlan gali magacaaga buuxa."));
      return;
    }
    if (password.length < 6) {
      setError(t("Password must be at least 6 characters.", "يجب أن تكون كلمة المرور 6 أحرف على الأقل.", "Furaha waa in uu ahaado ugu yaraan 6 xaraf."));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("Passwords do not match.", "كلمتا المرور غير متطابقتين.", "Furahada sir ah ma is-waafaqaan."));
      return;
    }

    setLoading(true);
    try {
      if (!supabase) throw new Error("Auth service not configured.");

      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name.trim(), role: "user" },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError(t("This email is already registered.", "هذا البريد الإلكتروني مسجل بالفعل.", "Emailkaan horay ayaa loo diiwaan geliyey."));
        } else {
          setError(authError.message);
        }
        return;
      }

      if (data.session) {
        setSuccess(true);
        setTimeout(() => setLocation("/dashboard"), 1500);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || t("Registration failed. Please try again.", "فشل التسجيل.", "Diiwaan gelinta waa fashilantay."));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[100dvh] pt-16 flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-10 rounded-3xl bg-card border border-green-500/20 max-w-sm mx-4"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">
            {t("Account created!", "تم إنشاء الحساب!", "Akoonka la sameeyay!")}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t(
              "Check your email to verify your account, then sign in.",
              "تحقق من بريدك الإلكتروني لتأكيد حسابك، ثم سجّل دخولك.",
              "Hubi emailkaaga si aad u xaqiijiso akoonkaaga, ka dibna gal."
            )}
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-opacity"
          >
            {t("Go to Sign In", "الذهاب لتسجيل الدخول", "Aad Galitaanka")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] pt-16 flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/18 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/12 rounded-full blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
        className="relative z-10 w-full max-w-md mx-4 my-8"
      >
        <div className="p-8 sm:p-10 rounded-3xl bg-card border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">

          <div className="text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center gap-3 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/25 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <img
                  src="/logo-96.png"
                  alt="Al-Bayaan College"
                  className="relative h-16 w-16 object-contain drop-shadow-[0_0_16px_rgba(139,92,246,0.7)]"
                />
              </div>
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Albayaan.pro
              </span>
            </Link>
            <h1 className="text-2xl font-black text-white">
              {t("Create your account", "إنشاء حسابك", "Samee akoonkaaga")}
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              {t("Start your learning journey today", "ابدأ رحلتك التعليمية اليوم", "Maanta bilow safarka waxbarashadaada")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t("Full Name", "الاسم الكامل", "Magaca Buuxa")}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(""); }}
                  required
                  autoComplete="name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 transition-all text-sm"
                  placeholder={t("Your full name", "اسمك الكامل", "Magacaaga buuxa")}
                />
              </div>
            </div>

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
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 transition-all text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t("Password", "كلمة المرور", "Furaha sir ah")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  required
                  autoComplete="new-password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 transition-all text-sm"
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

              {password && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    strength.score <= 1 ? "text-red-400" :
                    strength.score === 2 ? "text-orange-400" :
                    strength.score === 3 ? "text-yellow-400" :
                    "text-green-400"
                  }`}>
                    {strength.label}
                    {" "}—{" "}
                    {strength.score <= 2 && t("Try adding numbers or symbols.", "أضف أرقاماً أو رموزاً.", "Ku dar tiro ama astaan.")}
                    {strength.score === 3 && t("Add uppercase letters for better security.", "أضف حروفاً كبيرة لأمان أفضل.", "Ku dar xarfaha weyn.")}
                    {strength.score >= 4 && t("Great password!", "كلمة مرور ممتازة!", "Furaha waa fiican yahay!")}
                  </p>
                </motion.div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t("Confirm Password", "تأكيد كلمة المرور", "Xaqiiji Furaha sir ah")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError(""); }}
                  required
                  autoComplete="new-password"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all text-sm ${
                    confirmPassword
                      ? passwordsMatch
                        ? "border-green-500/50 focus:border-green-500/70 focus:ring-green-500/30"
                        : "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/30"
                      : "border-white/10 focus:border-purple-500/60 focus:ring-purple-500/40"
                  }`}
                  placeholder="••••••••"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {confirmPassword && (
                    passwordsMatch
                      ? <CheckCircle className="w-4 h-4 text-green-400" />
                      : <span className="w-4 h-4 text-red-400 font-bold text-sm">✕</span>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-gray-500 hover:text-gray-300 transition-colors ml-1"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all disabled:opacity-60 flex items-center justify-center gap-2.5 mt-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {t("Creating account…", "جارٍ إنشاء الحساب…", "La samaynayaa…")}</>
              ) : (
                <>{t("Create Free Account", "إنشاء حساب مجاني", "Samee Akoon Bilaash ah")} <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            {t("By signing up, you agree to our", "بالتسجيل، أنت توافق على", "Diiwaangelinta, waxaad oggolaataa")}{" "}
            <span className="text-blue-400 cursor-pointer hover:underline">{t("Terms of Service", "شروط الخدمة", "Shuruudaha")}</span>
            {" "}{t("and", "و", "iyo")}{" "}
            <span className="text-blue-400 cursor-pointer hover:underline">{t("Privacy Policy", "سياسة الخصوصية", "Xeerka Sirta")}</span>
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-muted-foreground px-2">
              {t("Already have an account?", "لديك حساب بالفعل؟", "Ma haysataa akoon?")}
            </span>
            <div className="flex-1 h-px bg-white/8" />
          </div>
          <Link
            href="/auth/login"
            className="mt-4 w-full py-3 rounded-xl border border-white/10 text-muted-foreground hover:text-white hover:border-white/20 hover:bg-white/5 font-medium text-sm flex items-center justify-center gap-2 transition-all"
          >
            {t("Sign in instead", "تسجيل الدخول بدلاً من ذلك", "Gal halkii")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
