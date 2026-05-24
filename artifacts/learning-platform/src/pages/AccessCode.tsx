import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useVerifyCode } from "@workspace/api-client-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Key, Loader2, CheckCircle2, ArrowRight } from "lucide-react";

export default function AccessCode() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successCourse, setSuccessCourse] = useState<any>(null);

  const { mutate, isPending } = useVerifyCode({
    mutation: {
      onSuccess: (data: any) => {
        setSuccess(true);
        setSuccessCourse(data);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.error;
        if (msg === "Code already used") {
          setError(t("This code has already been used.", "هذا الرمز مستخدم بالفعل.", "Koodhkaan horay ayaa loo isticmaalay."));
        } else if (msg === "Code not found") {
          setError(t("Invalid code. Please check and try again.", "رمز غير صحيح. يرجى التحقق والمحاولة مرة أخرى.", "Koodhka waa khalad. Fadlan hubi oo isku day mar kale."));
        } else {
          setError(t("Something went wrong. Please try again.", "حدث خطأ ما. الرجاء المحاولة مرة أخرى.", "Wax khalad ah ayaa dhacay. Fadlan isku day mar kale."));
        }
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user) {
      setLocation("/auth/login");
      return;
    }
    mutate({ data: { code: code.trim().toUpperCase() } });
  };

  return (
    <div className="min-h-[100dvh] pt-16 flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {success ? (
          <div className="p-8 rounded-3xl bg-card border border-green-500/30 shadow-[0_0_60px_rgba(0,0,0,0.5)] text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">{t("Access Granted!", "تم منح الوصول!", "Galitaanka waa la siiyay!")}</h2>
            <p className="text-muted-foreground mb-6">{t("You now have access to your course.", "لديك الآن وصول إلى دورتك.", "Hadda waad geli kartaa koorsahaaga.")}</p>
            <button
              onClick={() => setLocation("/dashboard")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all"
            >
              {t("Go to Dashboard", "انتقل إلى لوحة القيادة", "Tag Dhaq-dhaqaaqa")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-card border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-white">{t("Redeem Access Code", "استرداد رمز الدخول", "Furo Koodhka Galitaanka")}</h1>
              <p className="text-muted-foreground text-sm mt-2">
                {t("Enter your access code to unlock your course", "أدخل رمز الدخول الخاص بك لفتح دورتك", "Geli koodhkaaga si aad u furto koorsahaaga")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t("Access Code", "رمز الدخول", "Koodhka Galitaanka")}</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  required
                  className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-center text-xl font-mono tracking-widest placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder="XXXX-XXXX"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg text-center">{error}</p>
              )}

              {!user && (
                <p className="text-yellow-400/80 text-sm bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-lg text-center">
                  {t("You need to be logged in to redeem a code.", "تحتاج إلى تسجيل الدخول لاسترداد الرمز.", "Waa inaad gasho si aad koodhka u furto.")}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending || !code.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("Redeem Code", "استرداد الرمز", "Furo Koodhka")}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-muted-foreground text-center mb-4">{t("Don't have a code? Pay manually:", "ليس لديك رمز؟ ادفع يدوياً:", "Ma lihid koodh? Si gacanta ah u bixi:")}</p>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-green-400 font-bold mb-1">EVC Plus</div>
                  <div className="text-gray-400">+252 61 2035767</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-blue-400 font-bold mb-1">Somtel</div>
                  <div className="text-gray-400">+252 65 6042512</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-purple-400 font-bold mb-1">E-pir</div>
                  <div className="text-gray-400">0979695586</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
