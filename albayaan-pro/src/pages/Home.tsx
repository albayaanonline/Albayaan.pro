import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Link } from "wouter";
import {
  BookOpen, Users, Trophy, Zap, Globe, ShieldCheck, Star, ArrowRight,
  CheckCircle, Sparkles, Brain, Target,
} from "lucide-react";

const CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: CUBIC },
  }),
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: CUBIC },
  }),
};

const HERO_PHRASES = [
  { en: "Master Languages", ar: "أتقن اللغات", so: "Luuqadaha Sii Barashada" },
  { en: "Learn with AI",    ar: "تعلم بالذكاء الاصطناعي", so: "AI ku Baro" },
  { en: "Build Your Future", ar: "ابنِ مستقبلك", so: "Mustaqbalkaaga Dhis" },
  { en: "Study Anywhere",  ar: "ادرس في أي مكان", so: "Meel kasta ka Baro" },
];

export default function Home() {
  const { t, language } = useLanguage();
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHeroIdx(i => (i + 1) % HERO_PHRASES.length), 2800);
    return () => clearInterval(id);
  }, []);

  const heroPhrase = HERO_PHRASES[heroIdx];
  const heroText =
    language === "ar" ? heroPhrase.ar : language === "so" ? heroPhrase.so : heroPhrase.en;

  const stats = [
    { value: "10K+", label: t("Active Students", "طالب نشط", "Ardayda Firfircoon") },
    { value: "6",    label: t("Expert Courses",  "دورة متخصصة", "Koorso Khubradi ah") },
    { value: "95%",  label: t("Completion Rate", "معدل الإتمام", "Heerka Dhamaystirka") },
    { value: "4.9★", label: t("Average Rating",  "متوسط التقييم", "Celceliska Qiimaynta") },
  ];

  const features = [
    {
      icon: Brain, color: "from-blue-500 to-blue-600", bg: "bg-blue-500/10 border-blue-500/20",
      title: t("AI-Powered Learning", "التعلم بالذكاء الاصطناعي", "Waxbarasho AI ah"),
      desc: t("Our AI assistant helps you understand complex topics instantly.", "مساعدنا الذكي يساعدك على فهم المواضيع المعقدة فوراً.", "Kaaliyahaaga AI-ga ayaa kaa caawiya si aad si deg-deg ah u fahamto mawduucyada adag."),
    },
    {
      icon: Globe, color: "from-purple-500 to-purple-600", bg: "bg-purple-500/10 border-purple-500/20",
      title: t("Multi-language Support", "دعم متعدد اللغات", "Taageero Luuqaddo Badan"),
      desc: t("Learn in English, Arabic, or Somali — your choice.", "تعلم بالإنجليزية أو العربية أو الصومالية — اختيارك.", "Ku baro Ingiriisi, Carabi, ama Soomaali — doorashadaada."),
    },
    {
      icon: Target, color: "from-green-500 to-emerald-600", bg: "bg-green-500/10 border-green-500/20",
      title: t("Structured Curriculum", "منهج منظم", "Manhajka Nidaamsan"),
      desc: t("Step-by-step lessons designed for real-world fluency.", "دروس خطوة بخطوة مصممة للطلاقة في العالم الحقيقي.", "Casharro tallaabooyinka ku saleysan ee loogu talagalay shaqaynta adduunka."),
    },
    {
      icon: Trophy, color: "from-yellow-500 to-orange-500", bg: "bg-yellow-500/10 border-yellow-500/20",
      title: t("Certificates", "شهادات", "Shahaadooyinka"),
      desc: t("Earn verified certificates upon completing your courses.", "احصل على شهادات موثقة عند إتمام دوراتك.", "Hel shahaadooyinka la xaqiijiyay marka aad dhamayso koorsooyinkaaga."),
    },
    {
      icon: Zap, color: "from-pink-500 to-rose-500", bg: "bg-pink-500/10 border-pink-500/20",
      title: t("Interactive Quizzes", "اختبارات تفاعلية", "Imtixaanno Isdhexgal ah"),
      desc: t("Reinforce your learning with quizzes after every lesson.", "عزز تعلمك باختبارات بعد كل درس.", "Xooji waxbarashadaada adoo imtixaannada ka dib casharro kasta qaadan."),
    },
    {
      icon: ShieldCheck, color: "from-cyan-500 to-teal-500", bg: "bg-cyan-500/10 border-cyan-500/20",
      title: t("Access Code System", "نظام رموز الدخول", "Nidaamka Koodhka Galitaanka"),
      desc: t("Flexible enrollment — pay once, learn forever.", "تسجيل مرن — ادفع مرة وتعلم إلى الأبد.", "Diiwaangelinta fudud — hal mar bixi, weligaa baro."),
    },
  ];

  const howItWorks = [
    { icon: BookOpen, title: t("Browse Courses", "تصفح الدورات", "Baadh Koorsooyinka"), desc: t("Explore our curated catalog of language courses.", "استكشف فهرسنا المنتقى من دورات اللغة.", "Sahminta taxanaha koorsooyinkeena luuqadda.") },
    { icon: ShieldCheck, title: t("Enroll & Access", "سجل وادخل", "Diiwaangeli & Gal"), desc: t("Pay via mobile money or redeem an access code.", "ادفع عبر النقود المحمولة أو استرد رمز الوصول.", "Bixi lacag gacanta ama koodh geli.") },
    { icon: Brain, title: t("Learn & Practice", "تعلم وتمرن", "Baro & Tababar"), desc: t("Study at your pace with AI assistance anytime.", "ادرس بوتيرتك مع مساعدة الذكاء الاصطناعي في أي وقت.", "Si raaxo leh ugu baro caawimaad AI ah oo goor kasta ah.") },
    { icon: Trophy, title: t("Get Certified", "احصل على شهادة", "Shahaado Hel"), desc: t("Complete courses and earn your certificate.", "أكمل الدورات واحصل على شهادتك.", "Koorsooyinka dhamays oo shahaadadaada hel.") },
  ];

  const testimonials = [
    { name: "Ahmed Mohamed", role: t("English Student", "طالب اللغة الإنجليزية", "Ardayga Ingiriisiga"), content: t("Albayaan.pro transformed my English in just 3 months. The AI assistant is like having a personal tutor 24/7.", "غيّرت Albayaan.pro لغتي الإنجليزية في 3 أشهر فقط. المساعد الذكي يشبه وجود مدرس خاص على مدار الساعة.", "Albayaan.pro ayaa Ingiriiskayga ku baddalay 3 bilood gudahood. Kaaliyaha AI-ga wuxuu la mid yahay macallin gaar ah 24/7."), stars: 5 },
    { name: "Faadumo Hassan", role: t("Arabic Student", "طالبة اللغة العربية", "Ardayda Carabiga"), content: t("The multi-language support is amazing. I could learn Arabic while reading in Somali!", "دعم اللغات المتعددة رائع. يمكنني تعلم العربية أثناء القراءة بالصومالية!", "Taageerada luuqadaha badan ayaa cajiib ah. Waxaan ku baran karay Carabiga anigoo Soomaali ku akhrinaayo!"), stars: 5 },
    { name: "Omar Abdullah", role: t("Business Professional", "محترف أعمال", "Xirfadlaha Ganacsiga"), content: t("The access code system made it easy to gift courses to my team. Highly recommended!", "نظام رموز الوصول جعل من السهل إهداء الدورات لفريقي. أوصي به بشدة!", "Nidaamka koodhka galitaanka ayaa fududeeyay in aan koorsooyinka kooxdayda u hadiyeeyo. Aad baan u talinaayaa!"), stars: 5 },
  ];

  const plans = [
    { name: t("Starter", "المبتدئ", "Bilowga"), price: "$15", desc: t("1 course, lifetime access", "دورة واحدة، وصول مدى الحياة", "1 koorso, weligeed galitaan"), color: "from-blue-500 to-cyan-400", popular: false },
    { name: t("Pro Bundle", "الحزمة الاحترافية", "Xidhmo Xirfadeed"), price: "$45", desc: t("3 courses + AI tutoring", "3 دورات + تدريب ذكي", "3 koorso + tababar AI"), color: "from-purple-500 to-indigo-400", popular: true },
    { name: t("All Access", "الوصول الكامل", "Dhammaan Galitaanka"), price: "$79", desc: t("All 6 courses forever", "جميع الـ6 دورات للأبد", "Dhammaan 6-da koorso weligeed"), color: "from-amber-500 to-orange-400", popular: false },
  ];

  const paymentMethods = [
    { name: "Zaad",       emoji: "📱", desc: t("Mobile Money", "نقود موبايل", "Lacagta Mobilka"),    color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
    { name: "Waafi Pay",  emoji: "💰", desc: t("Mobile Wallet", "محفظة موبايل", "Khiisnaha Mobilka"), color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20" },
    { name: "VISA",       emoji: "💳", desc: t("Credit Card",   "بطاقة ائتمان",  "Kaarka Deynta"),     color: "text-sky-400",    bg: "bg-sky-500/10 border-sky-500/20" },
    { name: "Mastercard", emoji: "🔴", desc: t("Debit Card",    "بطاقة خصم",     "Kaarka Lacagta"),    color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20" },
    { name: "PayPal",     emoji: "🅿️", desc: t("Global Pay",   "دفع عالمي",     "Bixinta Caalamiga"), color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
    { name: "Stripe",     emoji: "⚡", desc: t("Secure Pay",   "دفع آمن",       "Bixin Ammaan ah"),   color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  ];

  return (
    <div className="w-full bg-background">

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none hero-blob" aria-hidden>
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-[60px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/12 rounded-full blur-[70px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto w-full space-y-6">

          {/* Badge */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary"
          >
            <Sparkles className="w-4 h-4" />
            {t("Next-gen AI learning platform", "منصة التعلم بالذكاء الاصطناعي من الجيل القادم", "Madal waxbarasho AI ah oo casri ah")}
          </motion.div>

          {/* Animated hero heading */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0.1}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={heroIdx}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease: CUBIC }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-purple-500"
              >
                {heroText}
              </motion.span>
            </AnimatePresence>
            <span className="block text-foreground text-3xl sm:text-4xl md:text-5xl mt-2 font-black">
              {t("at the Speed of AI", "بسرعة الذكاء الاصطناعي", "Xawliga AI ah")}
            </span>
          </motion.div>

          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={0.2}
            className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {t(
              "A premium AI-powered learning experience in English, Arabic & Somali. Enter your access code or enroll now.",
              "تجربة تعلم متميزة بالذكاء الاصطناعي بالإنجليزية والعربية والصومالية. أدخل رمزك أو سجل الآن.",
              "Khibrad waxbarasho oo AI ah oo heer sarena ku jirta Ingiriisi, Carabi iyo Soomaali. Geli koodhkaaga ama hadda is diiwaangeli."
            )}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0.3}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-2"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                href="/courses"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-shadow"
              >
                {t("Explore Courses", "استكشف الدورات", "Sahmi Koorsooyinka")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                href="/access-code"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/20 text-foreground font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                {t("Redeem Code", "استرداد الرمز", "Furo Koodhka")}
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0.4}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-sm text-muted-foreground"
          >
            {[
              t("No subscription required", "لا اشتراك مطلوب", "Rumeyn ma loo baahna"),
              t("Lifetime access", "وصول مدى الحياة", "Galitaan weligeed ah"),
              t("AI-assisted learning", "تعلم بمساعدة الذكاء الاصطناعي", "Waxbarasho AI la caawiso"),
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={cardVariant}
                custom={i}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 w-full">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          custom={0}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-medium text-purple-400 mb-4">
            <Zap className="w-4 h-4" />
            {t("Why Albayaan.pro?", "لماذا Albayaan.pro؟", "Maxay Albayaan.pro u koobaantahay?")}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            {t("Everything you need to", "كل ما تحتاجه", "Waxkasta oo aad u baahan tahay")}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {t("succeed in language learning", "النجاح في تعلم اللغة", "in aad luuqadda ku guulaysato")}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            {t("Built for modern learners who demand results, not just content.", "مصمم للمتعلمين العصريين الذين يطلبون النتائج، وليس فقط المحتوى.", "Loogu talagalay ardayda casriga ah ee dalbada natiijooyinka, maaha kaliya nuxurka.")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariant}
              custom={i}
              whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.2 } }}
              className={`p-6 rounded-2xl border ${feature.bg} cursor-default`}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-md shrink-0`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-card/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
              {t("How it works", "كيف يعمل", "Sida uu u shaqeeyo")}
            </h2>
            <p className="text-muted-foreground">
              {t("Go from zero to fluent in 4 simple steps.", "من الصفر إلى الطلاقة في 4 خطوات بسيطة.", "Eber ilaa shuruud 4 tallaabo fudud.")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariant}
                custom={i}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="text-center cursor-default"
              >
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 w-full">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          custom={0}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            {t("Loved by students", "يحبه الطلاب", "Ardaydu waxay jeclayaan")}
          </h2>
          <p className="text-muted-foreground">
            {t("Join thousands who've transformed their language skills.", "انضم إلى آلاف الأشخاص الذين غيروا مهاراتهم اللغوية.", "Ku biir kumannaan qof oo xirfadahooda luuqadda bedelay.")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((tm, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariant}
              custom={i}
              whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors cursor-default"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: tm.stars }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">"{tm.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {tm.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{tm.name}</div>
                  <div className="text-xs text-muted-foreground">{tm.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pricing Teaser ── */}
      <section className="py-16 bg-card/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
              {t("Simple, one-time pricing", "تسعير بسيط لمرة واحدة", "Qiime fudud oo hal mar ah")}
            </h2>
            <p className="text-muted-foreground">
              {t("Pay once, learn forever. No subscriptions.", "ادفع مرة وتعلم للأبد. بلا اشتراكات.", "Hal mar bixi, weligaa baro. Rumeyn malaha.")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariant}
                custom={i}
                whileHover={{ scale: 1.04, y: -4, transition: { duration: 0.2 } }}
                className={`relative p-6 rounded-2xl bg-card border text-center cursor-default ${plan.popular ? "border-purple-500/50" : "border-border"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold whitespace-nowrap">
                    ⭐ {t("Most Popular", "الأكثر شعبية", "Ugu Caansan")}
                  </div>
                )}
                <div className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.color} mb-1`}>{plan.price}</div>
                <div className="font-bold text-foreground mb-1">{plan.name}</div>
                <div className="text-sm text-muted-foreground mb-4">{plan.desc}</div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/pricing"
                    className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${plan.color} text-white font-bold text-sm flex items-center justify-center gap-1 hover:opacity-90 transition-opacity`}
                  >
                    {t("Get Started", "ابدأ الآن", "Bilow")} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Payment Partners ── */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
            className="text-center"
          >
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mb-8">
              {t("Trusted Payment Partners", "شركاء الدفع الموثوق بهم", "Wadaagayaasha Lacag Bixinta La Aaminsan")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {paymentMethods.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={cardVariant}
                  custom={i}
                  whileHover={{ scale: 1.08, y: -3, transition: { duration: 0.15 } }}
                  className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border ${p.bg} cursor-default`}
                >
                  <span className="text-xl">{p.emoji}</span>
                  <span className={`font-black text-xs ${p.color}`}>{p.name}</span>
                  <span className="text-xs text-muted-foreground text-center">{p.desc}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-card/20 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-600/15 to-purple-600/15 border border-border"
          >
            <Users className="w-10 h-10 text-primary mx-auto mb-5" />
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              {t("Start learning today", "ابدأ التعلم اليوم", "Maanta bilow waxbarasho")}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-xl mx-auto">
              {t("Join thousands of students mastering English and Arabic with Albayaan.pro.", "انضم إلى آلاف الطلاب الذين يتقنون الإنجليزية والعربية مع Albayaan.pro.", "Ku biir kumannaan arday oo Ingiriisiga iyo Carabiga la bartay oo Albayaan.pro la adeegsada.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/courses"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                >
                  {t("Browse Courses", "تصفح الدورات", "Baadh Koorsooyinka")}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/pricing"
                  className="px-8 py-4 rounded-full border border-border text-foreground font-bold text-lg flex items-center gap-2 hover:bg-white/5 transition-colors"
                >
                  {t("View Pricing", "عرض الأسعار", "Arag Qiimaha")}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
