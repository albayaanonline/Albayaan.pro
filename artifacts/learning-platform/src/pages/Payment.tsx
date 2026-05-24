import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { CheckCircle2, Phone, Copy, ArrowRight, CreditCard, Wallet, Smartphone, Shield, Clock, Star } from "lucide-react";
import { getCourseById } from "@/data/courses";

const ZAAD_NUMBER   = "0636042512";
const WAAFI_NUMBER  = "0636042512";
const WHATSAPP      = "+252656042512";

type Method = "zaad" | "waafi" | "card";

const METHODS = [
  {
    id: "zaad" as Method,
    name: "Zaad",
    flag: "🇸🇴",
    number: ZAAD_NUMBER,
    color: "from-green-600 to-emerald-500",
    border: "border-green-500/50",
    bg: "bg-green-500/10",
    textColor: "text-green-400",
    description: "Somali Mobile Money",
    icon: Smartphone,
  },
  {
    id: "waafi" as Method,
    name: "Waafi Pay",
    flag: "🇸🇴",
    number: WAAFI_NUMBER,
    color: "from-blue-600 to-cyan-500",
    border: "border-blue-500/50",
    bg: "bg-blue-500/10",
    textColor: "text-blue-400",
    description: "Waafi Mobile Payment",
    icon: Wallet,
  },
  {
    id: "card" as Method,
    name: "Visa / Mastercard",
    flag: "💳",
    number: "",
    color: "from-violet-600 to-purple-500",
    border: "border-violet-500/50",
    bg: "bg-violet-500/10",
    textColor: "text-violet-400",
    description: "Credit / Debit Card",
    icon: CreditCard,
  },
];

export default function Payment() {
  const { courseId } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const course = getCourseById(courseId || "");

  const [selectedMethod, setSelectedMethod] = useState<Method | "">("");
  const [whatsapp, setWhatsapp] = useState("");
  const [txId, setTxId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const getTitle = () => language === "ar" ? course?.titleAr : language === "so" ? course?.titleSo : course?.title;

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setLocation("/auth/login"); return; }
    setSubmitted(true);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setLocation("/auth/login"); return; }
    setSubmitted(true);
  };

  const selected = METHODS.find(m => m.id === selectedMethod);

  if (!course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-5xl">😕</div>
        <h2 className="text-xl font-bold text-foreground">{t("Course not found", "الدورة غير موجودة", "Koorsaha lama helin")}</h2>
        <button onClick={() => setLocation("/courses")} className="px-6 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
          {t("Browse Courses", "تصفح الدورات", "Baadh Koorsooyinka")}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] pt-20 pb-16 relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4">

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 rounded-3xl bg-card border border-green-500/30 text-center"
            >
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-500/20">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-3">{t("Payment Submitted!", "تم إرسال الدفعة!", "Lacag bixinta waa la gudbiyay!")}</h2>
              <p className="text-muted-foreground mb-2">
                {selectedMethod === "card"
                  ? t("Your card payment is being processed. You'll get course access shortly.", "تتم معالجة دفعة بطاقتك. ستحصل على الوصول للدورة قريباً.", "Bixinta kaarka waa la habeynayaa. Waxaad heli doontaa galitaanka koorso si dhakhso ah.")
                  : t("We'll verify your payment and send your access code via WhatsApp within 1-2 hours.", "سنتحقق من دفعتك ونرسل كود الوصول عبر واتساب خلال 1-2 ساعة.", "Waxaan xaqiijin doonaa bixintaada oo koodh kuu diri doonaa WhatsApp gudaha 1-2 saacadood.")}
              </p>
              {selectedMethod !== "card" && (
                <a href={`https://wa.me/${WHATSAPP.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-400 font-bold text-sm mb-8 hover:underline">
                  <Phone className="w-4 h-4" /> WhatsApp: {WHATSAPP}
                </a>
              )}
              <button onClick={() => setLocation("/courses")} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold flex items-center gap-2 justify-center hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all mt-6">
                {t("Back to Courses", "العودة إلى الدورات", "Ku Noqo Koorsooyinka")} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-black text-white">{t("Complete Payment", "إتمام الدفع", "Dhamays Lacag Bixinta")}</h1>
                <p className="text-muted-foreground mt-2">
                  {getTitle()} — <span className="text-white font-black text-xl">${course.price}</span>
                  <span className="text-xs text-muted-foreground ml-1">{t("one-time", "دفعة واحدة", "hal mar")}</span>
                </p>
              </div>

              {/* Course Summary */}
              <div className={`p-4 rounded-2xl border mb-6 flex items-center gap-4 ${course.gradient} border-white/10`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center text-2xl shrink-0`}>
                  {course.thumbnail}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm truncate">{getTitle()}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {course.rating}</span>
                    <span className="capitalize">{course.level}</span>
                    <span>{course.lessonCount} lessons</span>
                  </div>
                </div>
                <div className="text-2xl font-black text-white shrink-0">${course.price}</div>
              </div>

              {/* Step 1: Choose Method */}
              <div className="p-6 rounded-2xl bg-card border border-white/10 mb-5">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center">1</span>
                  {t("Choose Payment Method", "اختر طريقة الدفع", "Dooro Habka Lacag Bixinta")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {METHODS.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethod(m.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedMethod === m.id
                          ? `${m.border} ${m.bg}`
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{m.flag}</span>
                        <m.icon className={`w-4 h-4 ${selectedMethod === m.id ? m.textColor : "text-muted-foreground"}`} />
                      </div>
                      <div className={`font-bold text-sm ${selectedMethod === m.id ? m.textColor : "text-white"}`}>{m.name}</div>
                      <div className="text-muted-foreground text-xs mt-0.5">{m.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Details */}
              <AnimatePresence>
                {selectedMethod && selected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 rounded-2xl bg-card border border-white/10 mb-5"
                  >
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center">2</span>
                      {selectedMethod === "card"
                        ? t("Enter Card Details", "أدخل تفاصيل البطاقة", "Geli faahfaahinta kaarka")
                        : t("Send Payment & Confirm", "أرسل الدفعة وأكد", "Dir Lacagta oo Xaqiiji")}
                    </h3>

                    {selectedMethod !== "card" ? (
                      <form onSubmit={handleMobileSubmit} className="space-y-4">
                        {/* Number to send to */}
                        <div className={`p-4 rounded-xl ${selected.bg} border ${selected.border}`}>
                          <div className="text-sm text-muted-foreground mb-1">
                            {t(`Send $${course.price} to:`, `أرسل $${course.price} إلى:`, `U dir $${course.price} lambarka:`)}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className={`text-xl font-black font-mono tracking-widest ${selected.textColor}`}>
                              {selected.number}
                            </div>
                            <button
                              type="button"
                              onClick={() => copyNumber(selected.number)}
                              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border ${selected.border} ${selected.bg} ${selected.textColor} hover:opacity-80 transition-opacity`}
                            >
                              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              {copied ? t("Copied!", "تم النسخ!", "La koobiyeyay!") : t("Copy", "نسخ", "Koobiyee")}
                            </button>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {selectedMethod === "zaad" ? "📱 Ku bixi Zaad" : "💰 Ku bixi Waafi Pay"}
                            {" — "}
                            {t("Send the exact amount, then fill the form below.", "أرسل المبلغ بالضبط، ثم أكمل النموذج أدناه.", "U dir lacagta saxda ah, ka dibna buuxi foomka hoose.")}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">{t("Your WhatsApp Number *", "رقم واتساب الخاص بك *", "Nambarka WhatsApp-kaaga *")}</label>
                          <input
                            type="tel"
                            value={whatsapp}
                            onChange={e => setWhatsapp(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            placeholder="+252 61 xxxxxxx"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">{t("Transaction ID / Reference (optional)", "معرف المعاملة / المرجع (اختياري)", "ID-ga macaamalada / Tixraaca (ikhtiyaari)")}</label>
                          <input
                            type="text"
                            value={txId}
                            onChange={e => setTxId(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            placeholder={t("e.g. TXN-123456", "مثال: TXN-123456", "Tusaale: TXN-123456")}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={!whatsapp.trim()}
                          className={`w-full py-4 rounded-xl bg-gradient-to-r ${selected.color} text-white font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
                        >
                          {t("Submit Payment Confirmation", "إرسال تأكيد الدفع", "Gudbi Xaqiijinta Lacag Bixinta")}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleCardSubmit} className="space-y-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Shield className="w-3.5 h-3.5 text-green-400" />
                          {t("256-bit SSL encrypted payment", "دفع مشفر بـ256 بت SSL", "256-bit SSL encrypted bixinta")}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">{t("Cardholder Name", "اسم حامل البطاقة", "Magaca Haysiga Kaarka")}</label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={e => setCardName(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            placeholder={t("Full name on card", "الاسم الكامل على البطاقة", "Magaca buuxa ee kaarka")}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">{t("Card Number", "رقم البطاقة", "Nambarka Kaarka")}</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={e => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "))}
                              required
                              maxLength={19}
                              className="w-full px-4 py-3 pr-16 rounded-xl bg-white/5 border border-white/10 text-white font-mono placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all tracking-wider"
                              placeholder="0000 0000 0000 0000"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                              <span className="text-sm">💳</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">{t("Expiry", "تاريخ الانتهاء", "Taariikhda Dhicitaanka")}</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={e => setCardExpiry(e.target.value.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(?=\d)/, "$1/"))}
                              required
                              maxLength={5}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">CVC</label>
                            <input
                              type="text"
                              value={cardCvc}
                              onChange={e => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                              required
                              maxLength={4}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                              placeholder="•••"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                          <Clock className="w-4 h-4 shrink-0" />
                          {t("Card payments require Stripe integration. Contact us on WhatsApp to complete setup.", "مدفوعات البطاقة تتطلب تكامل Stripe. تواصل معنا عبر واتساب.", "Bixinta kaarka waxay u baahan tahay Stripe. Nala xiriir WhatsApp si aad dhamaystirto.")}
                        </div>

                        <button
                          type="submit"
                          disabled={!cardName || cardNumber.replace(/\s/g,"").length < 16 || cardExpiry.length < 5 || cardCvc.length < 3}
                          className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-lg hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-5 h-5" />
                          {t("Pay $", "ادفع $", "Bixi $")}{course.price}
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-green-400" />
                  {t("Secure payment", "دفع آمن", "Bixin ammaan ah")}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  {t("7-day money back", "استرداد 7 أيام", "7 maalmood lacag-celin")}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  {t("Lifetime access", "وصول مدى الحياة", "Weligeed gal")}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
