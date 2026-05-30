import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle, KeyRound, Lock } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const isRecoveryMode = typeof window !== "undefined" &&
    window.location.hash.includes("type=recovery");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError(t("Please enter your email address.", "الرجاء إدخال بريدك الإلكتروني.", "Fadlan gali emailkaaga."));
      return;
    }
    setLoading(true);
    try {
      if (!supabase) throw new Error("Auth service not configured.");
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/forgot-password`,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err: any) {
      setError(err.message || t("Something went wrong. Please try again.", "حدث خطأ ما.", "Khalad ayaa dhacay."));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      setError(t("Password must be at least 6 characters.", "يجب أن تكون كلمة المرور 6 أحرف على الأقل.", "Furaha waa in uu ahaado ugu yaraan 6 xaraf."));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("Passwords do not match.", "كلمتا المرور غير متطابقتين.", "Furahada sir ah ma is-waafaqaan."));
      return;
    }
    setUpdatingPassword(true);
    try {
      if (!supabase) throw new Error("Auth service not configured.");
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      setPasswordUpdated(true);
      setTimeout(() => setLocation("/auth/login"), 2000);
    } catch (err: any) {
      setError(err.message || t("Failed to update password.", "فشل تحديث كلمة المرور.", "Cusboonaysiin furaha wuu fashilmay."));
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (passwordUpdated) {
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
            {t("Password updated!", "تم تحديث كلمة المرور!", "Furaha la cusboonaysiin!")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t("Redirecting to sign in…", "جارٍ التوجيه لتسجيل الدخول…", "Waxaa laguu wareejinayaa galitaanka…")}
          </p>
        </motion.div>
      </div>
    );
  }

  if (isRecoveryMode) {
    return (
      <div className="min-h-[100dvh] pt-16 flex items-center justify-center relative overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md mx-4"
        >
          <div className="p-8 sm:p-10 rounded-3xl bg-card border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-2xl font-black text-white">
                {t("Set new password", "تعيين كلمة مرور جديدة", "Fur sir ah cusub deji")}
              </h1>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  {t("New Password", "كلمة المرور الجديدة", "Furaha Cusub")}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => { setNewPassword(e.target.value); setError(""); }}
                  required minLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  {t("Confirm Password", "تأكيد كلمة المرور", "Xaqiiji Furaha")}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError(""); }}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <div className="flex items-start gap-2.5 text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">
                  <span className="shrink-0 mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={updatingPassword}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base disabled:opacity-60 flex items-center justify-center gap-2.5"
              >
                {updatingPassword ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> {t("Updating…", "جارٍ التحديث…", "La cusboonaysiin…")}</>
                ) : (
                  t("Update Password", "تحديث كلمة المرور", "Cusboonaysii Furaha")
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] pt-16 flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-600/12 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {sent ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-card border border-green-500/20 shadow-[0_0_80px_rgba(0,0,0,0.5)] text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-3">
              {t("Check your email", "تحقق من بريدك الإلكتروني", "Hubi emailkaaga")}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {t(
                `If an account exists for ${email}, you'll receive a password reset link shortly. Check your spam folder too.`,
                `إذا كان حساب موجود لـ ${email}، ستتلقى رابط إعادة تعيين كلمة المرور قريباً.`,
                `Haddii akoon jiro ${email}, waxaad heli doontaa link dib u dejinta.`
              )}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="w-full py-3 rounded-xl border border-white/10 text-muted-foreground hover:text-white hover:border-white/20 hover:bg-white/5 font-medium text-sm transition-all"
              >
                {t("Try another email", "جرب بريداً آخر", "Isku day email kale")}
              </button>
              <Link
                href="/auth/login"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("Back to Sign In", "العودة إلى تسجيل الدخول", "Ku noqo Galitaanka")}
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-8 sm:p-10 rounded-3xl bg-card border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-2xl font-black text-white">
                {t("Reset your password", "إعادة تعيين كلمة المرور", "Dib u deji furaha sir ah")}
              </h1>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                {t(
                  "Enter your email and we'll send you a secure reset link.",
                  "أدخل بريدك الإلكتروني وسنرسل لك رابطاً آمناً.",
                  "Gali emailkaaga waxaan kugu diri doonaa link ammaan ah."
                )}
              </p>
            </div>

            <form onSubmit={handleRequestReset} className="space-y-5">
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
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all disabled:opacity-60 flex items-center justify-center gap-2.5"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> {t("Sending…", "جارٍ الإرسال…", "La dirayo…")}</>
                ) : (
                  <><Mail className="w-5 h-5" /> {t("Send Reset Link", "إرسال رابط الإعادة", "Dir Xiddigta Dib u Dejinta")}</>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("Back to Sign In", "العودة إلى تسجيل الدخول", "Ku noqo Galitaanka")}
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
