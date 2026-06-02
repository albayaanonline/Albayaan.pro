import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { MessageCircle, Mail, Phone, MapPin, Send, CheckCircle, Sparkles } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("API error");
    } catch {
      const body = `Name: ${form.name}%0AEmail: ${form.email}%0ASubject: ${form.subject || "(none)"}%0A%0A${form.message}`;
      window.open(`mailto:support@albayaan.pro?subject=${encodeURIComponent(form.subject || "Contact Form")} &body=${body}`, "_blank");
    } finally {
      setSending(false);
      setSent(true);
    }
  };

  const contacts = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+252 65 6042512",
      href: "https://wa.me/252656042512",
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      icon: Mail,
      label: t("Email", "البريد الإلكتروني", "Iimeel"),
      value: "support@albayaan.pro",
      href: "mailto:support@albayaan.pro",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      icon: Phone,
      label: t("Phone", "الهاتف", "Telefoonka"),
      value: "+252 65 6042512",
      href: "tel:+252656042512",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      icon: MapPin,
      label: t("Location", "الموقع", "Goobta"),
      value: t("Mogadishu, Somalia", "مقديشو، الصومال", "Muqdisho, Soomaaliya"),
      href: "#",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
  ];

  const faqs = [
    {
      q: t("How do I enroll in a course?", "كيف أسجل في دورة؟", "Sideen ugu diiwaangeli karaa koorso?"),
      a: t("Browse our courses, click Enroll, and complete payment via Zaad, Waafi, or card.", "تصفح دوراتنا، انقر تسجيل، وأكمل الدفع عبر Zaad أو Waafi أو البطاقة.", "Baadh koorsooyinkayada, guji Diiwaangeli, oo ku dhamee lacag bixinta Zaad, Waafi, ama kaarka."),
    },
    {
      q: t("Do courses expire?", "هل تنتهي صلاحية الدورات؟", "Ma dhammaanayaan koorsooyinku?"),
      a: t("No! Once you enroll, you get lifetime access to all course materials.", "لا! بمجرد التسجيل، يحق لك الوصول إلى جميع المواد مدى الحياة.", "Maya! Marka aad diiwaangasho, waxaad heshaa galitaan nolosha oo dhan."),
    },
    {
      q: t("Are certificates recognized?", "هل الشهادات معترف بها؟", "Ma aqoonsan yihiin shahaadooyinka?"),
      a: t("Yes, all Albayaan.pro certificates include a unique verification ID and are verifiable online.", "نعم، جميع شهادات Albayaan.pro تتضمن معرف تحقق فريداً.", "Haa, dhammaan shahaadooyinka Albayaan.pro waxay leeyihiin ID xaqiijin gaar ah."),
    },
    {
      q: t("Can I switch languages?", "هل يمكنني تغيير اللغة؟", "Ma beddeli karaa luuqadda?"),
      a: t("Absolutely! Toggle between English, Arabic, and Somali anytime from the language button in the top nav.", "بالتأكيد! تبديل بين الإنجليزية والعربية والصومالية.", "Haa! Beddel Ingiriisi, Carabi, iyo Soomaali xilkastoo."),
    },
  ];

  return (
    <div className="w-full bg-background min-h-screen">

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px] animate-glow-pulse" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-[70px] animate-glow-pulse" style={{ animationDelay: "2s" }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            {t("Get in Touch", "تواصل معنا", "Nala Xiriir")}
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0.1}
            className="text-4xl md:text-6xl font-black text-foreground mb-4 leading-tight">
            {t("We're Here to Help", "نحن هنا للمساعدة", "Waa Halkan Kaa Caawin")}
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={0.2}
            className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t(
              "Have a question? We typically respond within 2 hours via WhatsApp.",
              "هل لديك سؤال؟ نرد عادةً خلال ساعتين عبر WhatsApp.",
              "Su'aal ma qabtaa? Waxaan caadi ahaan ka jawaabaa 2 saacadood oo ku jira WhatsApp."
            )}
          </motion.p>
        </div>
      </section>

      {/* ── Contact Cards ── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {contacts.map((c, i) => (
            <motion.a key={i} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial="hidden" animate="visible" variants={fadeUp} custom={i * 0.08}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`p-5 rounded-2xl ${c.bg} border ${c.border} text-center flex flex-col items-center gap-3 transition-all`}>
              <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                <c.icon className={`w-5 h-5 ${c.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{c.label}</p>
                <p className={`text-sm font-bold ${c.color} mt-0.5`}>{c.value}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Form ── */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-2xl font-black text-foreground mb-6">
              {t("Send a Message", "أرسل رسالة", "Dir Fariin")}
            </h2>

            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-2xl bg-green-500/10 border border-green-500/30 text-center">
                <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-black text-foreground mb-2">
                  {t("Message Sent!", "تم الإرسال!", "Farriintu Way Dirtay!")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t("We'll reply within 2 hours via email or WhatsApp.", "سنرد خلال ساعتين عبر البريد أو WhatsApp.", "Waxaan ku jawaabi doonaa 2 saacadood oo ku jira email ama WhatsApp.")}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t("Your Name", "اسمك", "Magacaaga")} *
                    </label>
                    <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                      placeholder={t("Ahmed Mohamed", "أحمد محمد", "Axmed Maxamed")}
                      className="w-full px-4 py-3 rounded-xl bg-card border border-white/10 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
                      required />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t("Email Address", "البريد الإلكتروني", "Ciwaanka Emailka")} *
                    </label>
                    <input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                      type="email" placeholder="ahmed@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-card border border-white/10 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
                      required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    {t("Subject", "الموضوع", "Mawduuca")}
                  </label>
                  <input value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))}
                    placeholder={t("Course inquiry, payment, etc.", "استفسار عن دورة، دفع...", "Su'aal koorso, lacag bixin...")}
                    className="w-full px-4 py-3 rounded-xl bg-card border border-white/10 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    {t("Message", "الرسالة", "Farriinta")} *
                  </label>
                  <textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
                    placeholder={t("How can we help you?", "كيف يمكننا مساعدتك؟", "Sideen ku caawin karnaa?")}
                    rows={5} required
                    className="w-full px-4 py-3 rounded-xl bg-card border border-white/10 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none" />
                </div>
                <motion.button type="submit" disabled={sending}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-shadow disabled:opacity-60">
                  {sending ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                  ) : <Send className="w-5 h-5" />}
                  {sending ? t("Sending...", "جارٍ الإرسال...", "Waxa La Diraa...") : t("Send Message", "إرسال الرسالة", "Dir Farriinta")}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* ── FAQ ── */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.2}>
            <h2 className="text-2xl font-black text-foreground mb-6">
              {t("Frequently Asked Questions", "الأسئلة الشائعة", "Su'aalaha Inta Badan La Weydiiyo")}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={fadeUp} custom={i * 0.08}
                  className="p-5 rounded-2xl bg-card border border-white/10">
                  <p className="font-semibold text-foreground text-sm mb-2">{faq.q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="w-5 h-5 text-green-400" />
                <span className="font-bold text-foreground text-sm">
                  {t("Fastest Response: WhatsApp", "الرد الأسرع: WhatsApp", "Jawaabta Ugu Dhaqsaha badan: WhatsApp")}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {t("Message us directly for immediate help", "راسلنا مباشرة للمساعدة الفورية", "Noo dir fariin toos ah si aad u heshid caawin degdeg ah")}
              </p>
              <a href="https://wa.me/252656042512" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-bold hover:bg-green-400 transition-colors">
                <MessageCircle className="w-4 h-4" />
                {t("Open WhatsApp", "فتح WhatsApp", "Fur WhatsApp")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
