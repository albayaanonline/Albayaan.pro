import { motion } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Check, Zap, Crown, Star, ArrowRight, Phone, CreditCard, Wallet } from "lucide-react";

const ZAAD_NUMBER = "0636042512";
const WAAFI_NUMBER = "0636042512";

export default function Pricing() {
  const { t } = useLanguage();

  const plans = [
    {
      name: t("Starter", "المبتدئ", "Bilowga"),
      price: 15,
      period: t("/course", "/دورة", "/koorso"),
      icon: Star,
      color: "from-blue-500 to-cyan-500",
      border: "border-blue-500/30",
      glow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]",
      features: [
        t("1 course of your choice", "دورة واحدة من اختيارك", "1 koorso oo aad dooran"),
        t("Lifetime access to lessons", "وصول مدى الحياة للدروس", "Galitaan weligeed ah casharrada"),
        t("AI learning assistant", "مساعد التعلم الذكي", "Kaaliyaha barasho AI ah"),
        t("Quizzes & exercises", "اختبارات وتمارين", "Imtixaannada & jimicsiyada"),
        t("Completion certificate", "شهادة الإتمام", "Shahaadada dhameysirka"),
        t("Mobile app access", "الوصول عبر التطبيق", "Galitaanka app-ka"),
      ],
      cta: t("Get Started", "ابدأ الآن", "Bilow"),
      href: "/courses",
      popular: false,
    },
    {
      name: t("Pro Bundle", "الحزمة الاحترافية", "Xidhmo Xirfadeed"),
      price: 45,
      period: t("/3 courses", "/3 دورات", "/3 koorso"),
      icon: Zap,
      color: "from-purple-500 to-indigo-500",
      border: "border-purple-500/50",
      glow: "hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]",
      features: [
        t("3 courses (any language + level)", "3 دورات (أي لغة + مستوى)", "3 koorso (luuqad kasta + heer)"),
        t("Lifetime access to all 3", "وصول مدى الحياة للـ3 دورات", "Galitaan weligeed ah 3-da koorso"),
        t("Priority AI chat support", "دعم أولوية دردشة الذكاء الاصطناعي", "Taageero AI chat ah oo horraysa"),
        t("All quizzes & exercises", "جميع الاختبارات والتمارين", "Dhammaan imtixaannada & jimicsiyada"),
        t("3 certificates", "3 شهادات", "3 shahaadood"),
        t("WhatsApp group access", "الوصول لمجموعة واتساب", "Galitaanka kooxda WhatsApp"),
        t("1-on-1 AI tutoring sessions", "جلسات تدريب فردي مع الذكاء الاصطناعي", "Xaaladaha tababarka 1-ka-1 AI ah"),
      ],
      cta: t("Get Pro Bundle", "احصل على الحزمة الاحترافية", "Hel Xidhmo Xirfadeedka"),
      href: "/courses",
      popular: true,
    },
    {
      name: t("All Access", "الوصول الكامل", "Dhammaan Galitaanka"),
      price: 79,
      period: t("/all courses", "/جميع الدورات", "/dhammaan koorsooyinka"),
      icon: Crown,
      color: "from-amber-500 to-orange-500",
      border: "border-amber-500/30",
      glow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]",
      features: [
        t("All 6 courses (EN + AR all levels)", "جميع الـ6 دورات (إنج + عربي جميع المستويات)", "Dhammaan 6-da koorso (Ingiriisi + Carabi dhammaan heerarka)"),
        t("Lifetime unlimited access", "وصول غير محدود مدى الحياة", "Galitaan weligeed ah oo aan xaddidnayn"),
        t("Priority AI chat support 24/7", "دعم الدردشة الذكية 24/7", "Taageero AI 24/7"),
        t("All certificates (6 total)", "جميع الشهادات (6 في المجموع)", "Dhammaan shahaadooyinka (6 wadarta)"),
        t("Exclusive community access", "الوصول الحصري للمجتمع", "Galitaanka bulshada gaarka ah"),
        t("Live Q&A sessions", "جلسات أسئلة وأجوبة مباشرة", "Xaaladaha su'aasha & jawaabta tooska ah"),
        t("Admin dashboard access", "الوصول للوحة التحكم", "Galitaanka xafiiska maamulka"),
        t("Future courses free", "الدورات المستقبلية مجانية", "Koorsooyinka mustaqbalka bilaash"),
      ],
      cta: t("Get All Access", "احصل على الوصول الكامل", "Hel Dhammaan Galitaanka"),
      href: "/courses",
      popular: false,
    },
  ];

  const paymentMethods = [
    {
      name: "Zaad",
      nameDisplay: "Zaad",
      number: ZAAD_NUMBER,
      flag: "🇸🇴",
      color: "from-green-600 to-emerald-500",
      bg: "bg-green-500/10 border-green-500/30",
      icon: Phone,
      description: t("Send via Zaad mobile money", "أرسل عبر زعد موبايل موني", "Dir lacag Zaad"),
      steps: [
        t("Open your Zaad app", "افتح تطبيق زعد", "Fur app-ka Zaad"),
        t(`Send to: ${ZAAD_NUMBER}`, `أرسل إلى: ${ZAAD_NUMBER}`, `U dir: ${ZAAD_NUMBER}`),
        t("Send us your WhatsApp number", "أرسل لنا رقم واتساب", "Noo dir nambarka WhatsApp"),
      ],
    },
    {
      name: "Waafi Pay",
      nameDisplay: "Waafi Pay",
      number: WAAFI_NUMBER,
      flag: "🇸🇴",
      color: "from-blue-600 to-cyan-500",
      bg: "bg-blue-500/10 border-blue-500/30",
      icon: Wallet,
      description: t("Send via Waafi Pay mobile", "أرسل عبر وافي باي", "Dir lacag Waafi Pay"),
      steps: [
        t("Open your Waafi Pay app", "افتح تطبيق وافي باي", "Fur app-ka Waafi Pay"),
        t(`Send to: ${WAAFI_NUMBER}`, `أرسل إلى: ${WAAFI_NUMBER}`, `U dir: ${WAAFI_NUMBER}`),
        t("Send us proof via WhatsApp", "أرسل لنا دليل الدفع عبر واتساب", "Noo dir caddaynta WhatsApp"),
      ],
    },
    {
      name: "Stripe / Card",
      nameDisplay: "Visa / Mastercard",
      number: "",
      flag: "💳",
      color: "from-violet-600 to-purple-500",
      bg: "bg-violet-500/10 border-violet-500/30",
      icon: CreditCard,
      description: t("Pay with credit/debit card", "ادفع ببطاقة الائتمان/الخصم", "Ku bixi kaarka deynta/bixinta"),
      steps: [
        t("Click 'Pay with Card'", "انقر على 'ادفع بالبطاقة'", "Guji 'Bixi Kaarka'"),
        t("Enter your card details", "أدخل تفاصيل بطاقتك", "Geli faahfaahinta kaarka"),
        t("Instant course access", "وصول فوري للدورة", "Galitaan koorso ah isla markiiba"),
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-medium text-purple-400 mb-4">
            <Zap className="w-4 h-4" />
            {t("Simple, transparent pricing", "تسعير بسيط وشفاف", "Qiime fudud oo muuqda")}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
            {t("Invest in your", "استثمر في", "Ku maalgeli")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"> {t("future", "مستقبلك", "mustaqbalkaaga")}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("One-time payment. Lifetime access. No subscriptions.", "دفعة واحدة. وصول مدى الحياة. لا اشتراكات.", "Hal mar bixi. Weligeed gal. Rumeyn malaha.")}
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-3xl bg-card border ${plan.border} ${plan.glow} transition-all duration-300 flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-lg">
                    ⭐ {t("Most Popular", "الأكثر شيوعاً", "Ugu Caansan")}
                  </div>
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                <plan.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-foreground">${plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full py-3.5 rounded-xl font-bold text-center transition-all duration-300 flex items-center justify-center gap-2 ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
                    : "bg-white/5 border border-white/10 text-foreground hover:bg-white/10"
                }`}
              >
                {plan.cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
              {t("How to Pay", "كيفية الدفع", "Sidee Loo Bixiyaa")}
            </h2>
            <p className="text-muted-foreground">
              {t("Choose your preferred payment method", "اختر طريقة الدفع المفضلة لديك", "Dooro habka lacag bixinta ee aad jeceshahay")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMethods.map((method, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border ${method.bg}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{method.flag}</span>
                  <div>
                    <div className={`font-black text-xl text-transparent bg-clip-text bg-gradient-to-r ${method.color}`}>{method.nameDisplay}</div>
                    <div className="text-xs text-muted-foreground">{method.description}</div>
                  </div>
                </div>

                {method.number && (
                  <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-center">
                    <div className="text-xs text-muted-foreground mb-1">{t("Send to number:", "أرسل إلى:", "U dir nambarka:")}</div>
                    <div className="text-lg font-black text-foreground tracking-wider">{method.number}</div>
                  </div>
                )}

                <ol className="space-y-2">
                  {method.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${method.color} text-white text-xs flex items-center justify-center shrink-0 font-bold mt-0.5`}>
                        {j + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>

                {!method.number && (
                  <Link
                    href="/courses"
                    className={`mt-4 w-full py-3 rounded-xl bg-gradient-to-r ${method.color} text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
                  >
                    <CreditCard className="w-4 h-4" />
                    {t("Pay with Card", "ادفع بالبطاقة", "Bixi Kaarka")}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center">
            <p className="text-amber-300 text-sm font-medium">
              💬 {t("After payment, WhatsApp us your receipt at:", "بعد الدفع، أرسل لنا الوصل عبر واتساب على:", "Ka dib lacag bixinta, WhatsApp noogu dir rasiidhka:")}
              {" "}
              <a href={`https://wa.me/${ZAAD_NUMBER}`} target="_blank" rel="noopener noreferrer" className="font-black text-amber-400 hover:underline">
                +252 {ZAAD_NUMBER}
              </a>
            </p>
          </div>
        </motion.div>

        {/* Trust Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-muted-foreground text-sm mb-6 uppercase tracking-widest font-medium">
            {t("Accepted Payment Methods", "طرق الدفع المقبولة", "Habab Lacag Bixin oo La Aqbalay")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { name: "Zaad", emoji: "📱", color: "text-green-400" },
              { name: "Waafi Pay", emoji: "💰", color: "text-blue-400" },
              { name: "VISA", emoji: "💳", color: "text-blue-300" },
              { name: "Mastercard", emoji: "🔴", color: "text-red-400" },
              { name: "PayPal", emoji: "🅿️", color: "text-indigo-400" },
              { name: "Stripe", emoji: "⚡", color: "text-purple-400" },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                <span className="text-xl">{p.emoji}</span>
                <span className={`font-bold text-sm ${p.color}`}>{p.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-foreground text-center mb-8">
            {t("Frequently Asked Questions", "الأسئلة الشائعة", "Su'aalaha Inta Badan La Weydiiyo")}
          </h2>
          <div className="space-y-4">
            {[
              {
                q: t("Is it a one-time payment?", "هل الدفع مرة واحدة فقط؟", "Ma hal mar baad bixinaysaa?"),
                a: t("Yes! You pay once and get lifetime access to your course(s). No monthly fees.", "نعم! تدفع مرة واحدة وتحصل على وصول مدى الحياة. لا رسوم شهرية.", "Haa! Hal mar baad bixisaa oo weligaa galitaan u heshaa koorsooyinkaaga. Khidmad bilaa lacag ah malaha."),
              },
              {
                q: t("What if I can't pay by card?", "ماذا لو لم أتمكن من الدفع بالبطاقة؟", "Haddaan ku bixin karin kaarka?"),
                a: t("Use Zaad or Waafi Pay mobile money. Send the amount to 0636042512, then WhatsApp us proof.", "استخدم زعد أو وافي باي. أرسل المبلغ إلى 0636042512، ثم أرسل لنا الدليل عبر واتساب.", "Isticmaal Zaad ama Waafi Pay. U dir lacagta 0636042512, ka dibna WhatsApp noogu dir caddaynta."),
              },
              {
                q: t("When do I get access?", "متى أحصل على الوصول؟", "Goorma baad galitaan u heshaa?"),
                a: t("Card payments are instant. Zaad/Waafi payments are verified within 1-2 hours via WhatsApp.", "مدفوعات البطاقة فورية. تُتحقق مدفوعات زعد/وافي خلال 1-2 ساعة عبر واتساب.", "Bixinta kaarka isla markiiba. Bixinta Zaad/Waafi way xaqiijisaa gudaha 1-2 saacadood WhatsApp."),
              },
              {
                q: t("Can I get a refund?", "هل يمكنني استرداد المبلغ؟", "Ma heli karaa lacag celinta?"),
                a: t("We offer a 7-day money-back guarantee if you're not satisfied with the course quality.", "نقدم ضمان استرداد المبلغ خلال 7 أيام إذا لم تكن راضياً عن جودة الدورة.", "Waxaan bixinnaa damaanada lacag-celinta 7-ka maalood haddaadan ku qanacsan tayada koorso."),
              },
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-white/10">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
