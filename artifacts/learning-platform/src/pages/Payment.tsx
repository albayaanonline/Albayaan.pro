import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useGetCourse, useSubmitPayment } from "@workspace/api-client-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Loader2, CheckCircle2, Phone, Copy, ArrowRight } from "lucide-react";

const PAYMENT_METHODS = [
  { id: "evc_plus", name: "EVC Plus", number: "+252 61 2035767", color: "from-green-600 to-emerald-500", textColor: "text-green-400" },
  { id: "somtel", name: "Somtel", number: "+252 65 6042512", color: "from-blue-600 to-cyan-500", textColor: "text-blue-400" },
  { id: "epir", name: "E-pir", number: "0979695586", color: "from-purple-600 to-violet-500", textColor: "text-purple-400" },
];

export default function Payment() {
  const { courseId } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { data: course, isLoading } = useGetCourse(Number(courseId), {
    query: { enabled: !!courseId }
  });

  const [selectedMethod, setSelectedMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const { mutate, isPending } = useSubmitPayment({
    mutation: {
      onSuccess: () => setSubmitted(true),
      onError: (err: any) => {
        setError(err?.response?.data?.error || t("Submission failed. Please try again.", "فشل الإرسال. يرجى المحاولة مرة أخرى.", "Gudbinta waa fashilantay. Fadlan isku day mar kale."));
      },
    },
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ""));
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setLocation("/auth/login"); return; }
    setError("");
    mutate({
      data: {
        courseId: Number(courseId),
        whatsappNumber,
        notes: notes || undefined,
      }
    });
  };

  const getTitle = (item: any) => language === "ar" ? item?.titleAr : language === "so" ? item?.titleSo : item?.title;

  if (isLoading) return <div className="p-8 text-center text-primary">Loading...</div>;

  return (
    <div className="min-h-[100dvh] pt-20 pb-12 relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-3xl bg-card border border-green-500/30 text-center"
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{t("Payment Submitted!", "تم إرسال الدفعة!", "Lacag bixinta waa la gudbiyay!")}</h2>
            <p className="text-muted-foreground mb-2">
              {t("We will verify your payment and send your access code via WhatsApp within 1-2 hours.", "سنتحقق من دفعتك ونرسل لك رمز الوصول عبر واتساب خلال 1-2 ساعة.", "Waxaan xaqiijin doonaa bixintaada oo koodh kuu diri doonaa WhatsApp gudaha 1-2 saacadood.")}
            </p>
            <p className="text-blue-400 font-medium text-sm mb-8">WhatsApp: +252 65 6042512</p>
            <button onClick={() => setLocation("/courses")} className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold flex items-center gap-2 mx-auto hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
              {t("Back to Courses", "العودة إلى الدورات", "Ku Noqo Koorsooyinka")} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-3xl font-black text-white">{t("Complete Payment", "إتمام الدفع", "Dhamays Lacag Bixinta")}</h1>
              {course && (
                <p className="text-muted-foreground mt-2">{getTitle(course)} — <span className="text-white font-bold">${course.price}</span></p>
              )}
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-6 rounded-2xl bg-card border border-white/10">
                <h3 className="font-semibold text-white mb-4">{t("1. Choose Payment Method", "1. اختر طريقة الدفع", "1. Dooro Habka Lacag Bixinta")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PAYMENT_METHODS.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${selectedMethod === method.id ? "border-primary bg-primary/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                    >
                      <div className={`font-bold text-lg ${method.textColor}`}>{method.name}</div>
                      <div className="text-gray-400 text-xs mt-1 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {method.number}
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={e => { e.stopPropagation(); copyToClipboard(method.number, method.id); }}
                          onKeyDown={e => e.key === "Enter" && copyToClipboard(method.number, method.id)}
                          className="ml-1 hover:text-white transition-colors cursor-pointer"
                        >
                          {copied === method.id ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedMethod && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-card border border-white/10 space-y-4"
                >
                  <h3 className="font-semibold text-white">{t("2. Send Payment & Enter Details", "2. أرسل الدفعة وأدخل التفاصيل", "2. Dir Lacagta oo Geli Faahfaahinta")}</h3>
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300">
                    {t(`Send $${course?.price} to`, `أرسل $${course?.price} إلى`, `U dir $${course?.price} taleefanka`)}
                    {" "}
                    <span className="font-bold text-white">{PAYMENT_METHODS.find(m => m.id === selectedMethod)?.number}</span>
                    {" "}{t("then fill in the details below.", "ثم أدخل التفاصيل أدناه.", "ka dibna buuxi faahfaahinta hoose.")}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t("Your WhatsApp Number", "رقم واتساب الخاص بك", "Nambarka WhatsApp-kaaga")}</label>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={e => setWhatsappNumber(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      placeholder="+252 61 xxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t("Notes (optional)", "ملاحظات (اختياري)", "Xusuusiyo (ikhtiyaari)")}</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      placeholder={t("Transaction ID or any reference", "معرف المعاملة أو أي مرجع", "ID-ga macaamalada ama tixraac kasta")}
                    />
                  </div>
                </motion.div>
              )}

              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={isPending || !selectedMethod || !whatsappNumber.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                {t("Submit Payment", "إرسال الدفعة", "Gudbi Lacag Bixinta")}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
