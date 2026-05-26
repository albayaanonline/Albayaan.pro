import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Link } from "wouter";
import {
  BookOpen, Users, Trophy, Zap, Globe, ShieldCheck, Star, ArrowRight,
  CheckCircle, Sparkles, Brain, Target, GraduationCap, Lightbulb,
  Code2, Briefcase, Palette, TrendingUp, FlaskConical, Calculator,
  Play, Award, ChevronRight, Bot, MessageCircle,
} from "lucide-react";

const CUBIC = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay, ease: CUBIC },
  }),
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: CUBIC },
  }),
};

const HERO_PHRASES = [
  { en: "Learn with AI",        ar: "تعلم بالذكاء الاصطناعي",   so: "AI ku Baro" },
  { en: "Build Your Future",    ar: "ابنِ مستقبلك",              so: "Mustaqbalkaaga Dhis" },
  { en: "Master Modern Skills", ar: "أتقن المهارات الحديثة",    so: "Xirfadaha Casriga Soo Xifdiso" },
  { en: "Study Anywhere",       ar: "ادرس في أي مكان",          so: "Meel kasta ka Baro" },
  { en: "Learn Without Limits", ar: "تعلم بلا حدود",            so: "Xad La'aane Baro" },
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
    { value: "25K+", label: t("Active Students", "طالب نشط", "Ardayda Firfircoon") },
    { value: "18",   label: t("Expert Courses", "دورة متخصصة", "Koorso Khubradi ah") },
    { value: "95%",  label: t("Completion Rate", "معدل الإتمام", "Heerka Dhamaystirka") },
    { value: "4.9★", label: t("Average Rating", "متوسط التقييم", "Celceliska Qiimaynta") },
  ];

  const features = [
    {
      icon: Brain, color: "from-blue-500 to-blue-600", bg: "bg-blue-500/10 border-blue-500/20",
      title: t("AI-Powered Learning", "التعلم بالذكاء الاصطناعي", "Waxbarasho AI ah"),
      desc: t("Our AI assistant helps you understand complex topics instantly.", "مساعدنا الذكي يساعدك على فهم المواضيع المعقدة فوراً.", "Kaaliyahaaga AI-ga ayaa kaa caawiya."),
    },
    {
      icon: Globe, color: "from-purple-500 to-purple-600", bg: "bg-purple-500/10 border-purple-500/20",
      title: t("3 Languages", "3 لغات", "3 Luuqadood"),
      desc: t("Learn in English, Arabic, or Somali — your choice.", "تعلم بالإنجليزية أو العربية أو الصومالية.", "Ku baro Ingiriisi, Carabi, ama Soomaali."),
    },
    {
      icon: Target, color: "from-green-500 to-emerald-600", bg: "bg-green-500/10 border-green-500/20",
      title: t("Structured Curriculum", "منهج منظم", "Manhajka Nidaamsan"),
      desc: t("Step-by-step lessons for school, university, and career.", "دروس منظمة للمدرسة والجامعة والمهنة.", "Casharro tillaabooyin ah dugsiga, jaamacadda, shaqada."),
    },
    {
      icon: Trophy, color: "from-yellow-500 to-orange-500", bg: "bg-yellow-500/10 border-yellow-500/20",
      title: t("Certificates", "شهادات", "Shahaadooyinka"),
      desc: t("Earn verified PDF certificates upon completing your courses.", "احصل على شهادات PDF موثقة عند إتمام دوراتك.", "Hel shahaadooyin PDF ah marka aad dhamaysato."),
    },
    {
      icon: Zap, color: "from-pink-500 to-rose-500", bg: "bg-pink-500/10 border-pink-500/20",
      title: t("Interactive Quizzes", "اختبارات تفاعلية", "Imtixaanno Isdhexgal ah"),
      desc: t("Reinforce your learning with quizzes after every lesson.", "عزز تعلمك باختبارات بعد كل درس.", "Xooji waxbarashadaada imtixaannada ku."),
    },
    {
      icon: ShieldCheck, color: "from-cyan-500 to-teal-500", bg: "bg-cyan-500/10 border-cyan-500/20",
      title: t("Access Code System", "نظام رموز الدخول", "Nidaamka Koodhka"),
      desc: t("Flexible enrollment — pay once, learn forever.", "تسجيل مرن — ادفع مرة وتعلم إلى الأبد.", "Diiwaangelinta fudud — hal mar bixi."),
    },
  ];

  const testimonials = [
    { name: "Ahmed Mohamed",  role: t("English Student",    "طالب الإنجليزية", "Ardayga Ingiriisiga"),  content: t("Albayaan.pro transformed my English in just 3 months.", "غيّرت Albayaan.pro لغتي الإنجليزية في 3 أشهر.", "Albayaan.pro ayaa Ingiriiskayga ku baddalay 3 bilood."), stars: 5 },
    { name: "Faadumo Hassan", role: t("Arabic Student",     "طالبة العربية",   "Ardayda Carabiga"),     content: t("The AI assistant is available 24/7. Amazing platform!", "المساعد الذكي متاح على مدار الساعة. منصة رائعة!", "Kaaliyaha AI-ga ayaa la heli karo 24/7. Platform cajiib ah!"), stars: 5 },
    { name: "Omar Abdullah",  role: t("Python Developer",   "مطور Python",     "Python Developer"),     content: t("Finished Python in 12 weeks and landed a freelancing job!", "أنهيت Python في 12 أسبوعاً وحصلت على عمل مستقل!", "Python 12 toddobaad ugu dhammeeyay oo shaqo freelance helay!"), stars: 5 },
  ];

  const plans = [
    { name: t("Starter", "المبتدئ", "Bilowga"),       price: "$15", desc: t("1 course, lifetime access", "دورة واحدة، وصول مدى الحياة", "1 koorso, weligeed"),       color: "from-blue-500 to-cyan-400",    popular: false },
    { name: t("Pro Bundle", "الحزمة الاحترافية", "Xidhmo Xirfadeed"), price: "$45", desc: t("3 courses + AI tutoring", "3 دورات + تدريب AI", "3 koorso + AI"), color: "from-purple-500 to-indigo-400", popular: true },
    { name: t("All Access", "الوصول الكامل", "Dhammaan"),   price: "$99", desc: t("All courses forever", "جميع الدورات للأبد", "Dhammaan koorsooyinka"),    color: "from-amber-500 to-orange-400", popular: false },
  ];

  return (
    <div className="w-full bg-background">

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-[60px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/12 rounded-full blur-[70px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto w-full space-y-6">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
            <Sparkles className="w-4 h-4" />
            {t("Next-gen AI learning platform", "منصة التعلم بالذكاء الاصطناعي", "Madal waxbarasho AI ah oo casri ah")}
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.1}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            <AnimatePresence mode="wait">
              <motion.span key={heroIdx}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease: CUBIC }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-purple-500">
                {heroText}
              </motion.span>
            </AnimatePresence>
            <span className="block text-foreground text-3xl sm:text-4xl md:text-5xl mt-2 font-black">
              {t("at the Speed of AI", "بسرعة الذكاء الاصطناعي", "Xawliga AI ah")}
            </span>
          </motion.div>

          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={0.2}
            className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            {t(
              "A premium AI-powered learning platform for School, University & Career skills in English, Arabic & Somali.",
              "منصة تعلم متميزة بالذكاء الاصطناعي للمدرسة والجامعة والمهارات المهنية.",
              "Madal waxbarasho AI ah oo heer sarena ah: Dugsiga, Jaamacadda & Xirfadaha."
            )}
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.3}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link href="/curriculum"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-shadow">
                <GraduationCap className="w-5 h-5" />
                {t("School & University", "المدرسة والجامعة", "Dugsiga & Jaamacadda")}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link href="/courses"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/20 text-foreground font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                <Lightbulb className="w-5 h-5" />
                {t("Skills & Courses", "المهارات والدورات", "Xirfadaha & Koorsooyinka")}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link href="/ai-tutor"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-violet-500/40 text-violet-300 font-bold text-lg flex items-center justify-center gap-2 hover:bg-violet-600/30 transition-colors relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-blue-600/10 animate-pulse" />
                <Bot className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{t("AI Tutor", "المعلم الذكي", "Bare AI-ga")}</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.4}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-sm text-muted-foreground">
            {[
              t("No subscription required", "لا اشتراك مطلوب", "Rumeyn ma loo baahna"),
              t("Lifetime access", "وصول مدى الحياة", "Galitaan weligeed ah"),
              t("AI-assisted learning", "تعلم بمساعدة AI", "Waxbarasho AI la caawiso"),
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
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}
                variants={cardVariant} custom={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO LEARNING PATHS ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 w-full">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp} custom={0} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-400 mb-4">
            <BookOpen className="w-4 h-4" />
            {t("Choose Your Learning Path", "اختر مسار تعلمك", "Dooro Dariiqdaada Waxbarasho")}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            {t("Two Powerful Ways to", "طريقتان قويتان", "Laba Hab oo Xoog leh")}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {t("Learn at Al-Bayaan College", "للتعلم في كلية البيان", "Albayaan College ku Barasho")}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            {t(
              "Whether you're studying for school, pursuing a university degree, or learning modern career skills — we have the perfect path for you.",
              "سواء كنت تدرس للمدرسة أو تحصل على درجة جامعية أو تتعلم مهارات مهنية حديثة.",
              "Haddaad dugsiga u baraneyso, shahaadada jaamacadda raadsaneyso, ama xirfadaha cusub baraneyso — dariiqdaada haye."
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Path 1: School & University */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            variants={cardVariant} custom={0}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="relative p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 hover:border-blue-400/40 hover:shadow-[0_0_60px_rgba(59,130,246,0.15)] transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>

              <div className="mb-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                  {t("Section 1", "القسم الأول", "Qaybta 1")}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-foreground mb-2">
                {t("School & University", "المدرسة والجامعة", "Dugsiga & Jaamacadda")}
              </h3>
              <p className="text-sm text-blue-400 font-semibold mb-4">
                {t("Manhajka School-ka iyo Jaamacadaha", "منهج المدرسة والجامعات", "Manhajka School-ka iyo Jaamacadaha")}
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t(
                  "Structured academic curricula for school students and university learners. Mathematics, Science, English, Arabic, Computer Science, Islamic Studies, and more.",
                  "مناهج أكاديمية منظمة لطلاب المدارس والجامعات. الرياضيات والعلوم والإنجليزية والعربية وعلوم الحاسوب والدراسات الإسلامية.",
                  "Manhajyo nidaamsan oo ardayda dugsiga iyo jaamacadda. Xisaabta, Sayniska, Ingiriisiga, Carabiga, CS, Cilmiga Islaamiga."
                )}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: Calculator,    label: t("Mathematics",     "الرياضيات",     "Xisaabta") },
                  { icon: FlaskConical, label: t("Science",          "العلوم",        "Sayniska") },
                  { icon: Globe,        label: t("English & Arabic", "الإنجليزية والعربية", "Ingiriisi & Carabi") },
                  { icon: BookOpen,     label: t("Islamic Studies",  "الدراسات الإسلامية", "Cilmiga Islaamiga") },
                  { icon: Code2,        label: t("Computer Science", "علوم الحاسوب",  "Sayniska CS") },
                  { icon: GraduationCap,label: t("University Level", "مستوى الجامعة", "Heerka Jaamacadda") },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <item.icon className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <Link href="/curriculum">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] transition-shadow">
                  {t("Browse Curriculum", "تصفح المنهج", "Baadh Manhajka")}
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Path 2: Skills & Courses */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            variants={cardVariant} custom={1}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="relative p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-400/40 hover:shadow-[0_0_60px_rgba(139,92,246,0.15)] transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>

              <div className="mb-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                  {t("Section 2", "القسم الثاني", "Qaybta 2")}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-foreground mb-2">
                {t("Courses & New Skills", "الدورات والمهارات الجديدة", "Koorsooyinka & Xirfadaha Cusub")}
              </h3>
              <p className="text-sm text-purple-400 font-semibold mb-4">
                {t("Hel Courses iyo Skills Cusub", "احصل على دورات ومهارات جديدة", "Hel Courses iyo Skills Cusub")}
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t(
                  "Modern professional courses for career growth. AI, Programming, Web Dev, Design, Business, Freelancing, Data Science, and more — everything you need to succeed in 2025.",
                  "دورات مهنية حديثة للنمو الوظيفي. الذكاء الاصطناعي والبرمجة وتطوير الويب والتصميم والأعمال والعمل الحر.",
                  "Koorsooyinka xirfadlaha ah ee casriga ah: AI, Barnaamijka, Web Dev, Naqshadeynta, Ganacsiga, Freelancing."
                )}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: Brain,      label: t("AI & Machine Learning", "الذكاء الاصطناعي", "AI & ML") },
                  { icon: Code2,      label: t("Programming & Code",    "البرمجة",          "Barnaamijka") },
                  { icon: Briefcase,  label: t("Business & Freelancing","الأعمال والعمل الحر","Ganacsi & Freelance") },
                  { icon: Palette,    label: t("Design & Creativity",   "التصميم والإبداع", "Naqshadeynta") },
                  { icon: TrendingUp, label: t("Self-Development",      "التطوير الذاتي",   "Is-Horumarinta") },
                  { icon: Zap,        label: t("Career Growth",         "النمو المهني",     "Kobocda Xirfadeed") },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <item.icon className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <Link href="/courses">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_35px_rgba(139,92,246,0.5)] transition-shadow">
                  {t("Explore Courses", "استكشف الدورات", "Sahmi Koorsooyinka")}
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Quick stats row */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp} custom={0.3}
          className="mt-8 p-5 rounded-2xl bg-card/50 border border-border/50 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {[
            { icon: BookOpen,    label: t("9 Curriculum Courses",     "9 دورات منهجية",       "9 Koorso Manhaj") },
            { icon: Lightbulb,  label: t("9 Professional Courses",   "9 دورات مهنية",        "9 Koorso Xirfadeed") },
            { icon: Award,      label: t("PDF Certificates",          "شهادات PDF",           "Shahaadooyiin PDF") },
            { icon: Globe,      label: t("English · Arabic · Somali", "إنجليزي · عربي · صومالي", "Ingiriisi · Carabi · Soomaali") },
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              <item.icon className="w-4 h-4 text-primary shrink-0" />
              {item.label}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ── Featured Courses Preview ── */}
      <section className="py-16 bg-card/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp} custom={0} className="flex items-center justify-between mb-10">
            <div>
              <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                {t("🔥 Featured", "🔥 مميز", "🔥 Caanka ah")}
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground">
                {t("Most Popular Courses", "الدورات الأكثر شعبية", "Koorsooyinka Ugu Caansan")}
              </h2>
            </div>
            <Link href="/courses" className="hidden sm:flex items-center gap-1 text-sm text-primary hover:underline font-medium">
              {t("View all", "عرض الكل", "Dhamaan arag")} <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { id: "ai-mastery",      img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80", cat: "AI & Technology", badge: "🔥 Hot",    color: "from-violet-600 to-blue-500",   title: t("AI & Machine Learning Mastery", "إتقان الذكاء الاصطناعي", "AI & ML Soo Xifdiso"),     price: "$39", rating: "4.9", students: "4.5K+" },
              { id: "python-programming", img: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80", cat: "Programming", badge: "⭐ Popular", color: "from-yellow-500 to-green-500", title: t("Python – Zero to Hero",           "Python من الصفر",           "Python Eber ilaa Khabiir"), price: "$35", rating: "4.8", students: "3.2K+" },
              { id: "ar-beginner",     img: "https://images.unsplash.com/photo-1585079374502-415f8516dcc3?w=800&q=80", cat: "Arabic",         badge: "📚 Top",    color: "from-green-500 to-emerald-400", title: t("Arabic for Beginners",           "العربية للمبتدئين",          "Carabi Bilowga"),          price: "$15", rating: "4.9", students: "3.4K+" },
            ].map((course, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                variants={cardVariant} custom={i}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                className="rounded-2xl bg-card border border-white/10 overflow-hidden hover:border-primary/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300 group">
                <div className="relative aspect-video overflow-hidden">
                  <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${course.color} text-white`}>
                      {course.cat}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-sm text-white">
                      {course.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white text-xs font-bold">
                    <Play className="w-3 h-3" /> {t("Preview", "معاينة", "Daawo")}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground text-sm mb-2 line-clamp-2">{course.title}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                      <span className="text-muted-foreground/60">({course.students})</span>
                    </div>
                    <span className="font-bold text-primary">{course.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium">
              {t("View all courses", "عرض جميع الدورات", "Dhamaan koorsooyinka arag")} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 w-full">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp} custom={0} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-medium text-purple-400 mb-4">
            <Zap className="w-4 h-4" />
            {t("Why Albayaan.pro?", "لماذا Albayaan.pro؟", "Maxay Albayaan.pro u koobaantahay?")}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            {t("Everything you need to", "كل ما تحتاجه", "Waxkasta oo aad u baahan tahay")}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {t("succeed in learning", "النجاح في التعلم", "in aad ku guulaysato")}
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
              variants={cardVariant} custom={i}
              whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.2 } }}
              className={`p-6 rounded-2xl border ${feature.bg} cursor-default`}>
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
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
              {t("How it works", "كيف يعمل", "Sida uu u shaqeeyo")}
            </h2>
            <p className="text-muted-foreground">
              {t("Start learning in 4 simple steps.", "ابدأ التعلم في 4 خطوات بسيطة.", "Bilow waxbarasho 4 tallaabooyood fudud.")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BookOpen,    title: t("Browse Courses", "تصفح الدورات", "Baadh Koorsooyinka"),   desc: t("Pick from 18+ courses across 2 sections.", "اختر من أكثر من 18 دورة في قسمين.", "Dooro 18+ koorso 2 qayb.") },
              { icon: ShieldCheck, title: t("Enroll & Access", "سجل وادخل", "Diiwaangeli & Gal"),     desc: t("Pay or redeem an access code instantly.", "ادفع أو استرد رمز الوصول فوراً.", "Bixi ama geli koodh si deg-deg ah.") },
              { icon: Brain,       title: t("Learn with AI", "تعلم مع AI", "AI la Baro"),             desc: t("Study at your pace with AI assistance.", "ادرس بوتيرتك مع مساعدة AI.", "Raaxo leh ku baro caawimaad AI ah.") },
              { icon: Trophy,      title: t("Get Certified", "احصل على شهادة", "Shahaado Hel"),        desc: t("Download your PDF certificate instantly.", "حمّل شهادتك PDF فوراً.", "Degdeg soo degso shahaadadaada PDF.") },
            ].map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
                variants={cardVariant} custom={i}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="text-center cursor-default">
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
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp} custom={0} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            {t("Loved by students", "يحبه الطلاب", "Ardaydu waxay jeclayaan")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((tm, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
              variants={cardVariant} custom={i}
              whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors cursor-default">
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
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp} custom={0} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
              {t("Simple, one-time pricing", "تسعير بسيط لمرة واحدة", "Qiime fudud oo hal mar ah")}
            </h2>
            <p className="text-muted-foreground">
              {t("Pay once, learn forever. No subscriptions.", "ادفع مرة وتعلم للأبد. بلا اشتراكات.", "Hal mar bixi, weligaa baro. Rumeyn malaha.")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                variants={cardVariant} custom={i}
                whileHover={{ scale: 1.04, y: -4, transition: { duration: 0.2 } }}
                className={`relative p-6 rounded-2xl bg-card border text-center cursor-default ${plan.popular ? "border-purple-500/50" : "border-border"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold whitespace-nowrap">
                    ⭐ {t("Most Popular", "الأكثر شعبية", "Ugu Caansan")}
                  </div>
                )}
                <div className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.color} mb-1`}>{plan.price}</div>
                <div className="font-bold text-foreground mb-1">{plan.name}</div>
                <div className="text-sm text-muted-foreground mb-4">{plan.desc}</div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/pricing"
                    className={`block w-full py-2.5 rounded-xl font-bold text-sm text-center transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                        : "bg-white/5 border border-white/10 text-foreground hover:bg-white/10"
                    }`}>
                    {t("Get Started", "ابدأ الآن", "Hadda Bilow")}
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp} custom={0} className="relative p-12 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="text-4xl mb-4">🎓</div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
              {t("Ready to Start Learning?", "هل أنت مستعد للبدء؟", "Ma Diyaar u tahay Barashada?")}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {t(
                "Join 25,000+ students already learning on Al-Bayaan College. Start for free or redeem your access code.",
                "انضم إلى أكثر من 25,000 طالب يتعلمون على Albayaan College.",
                "Ku biir 25,000+ ardayda ah ee hada ku baranaya Albayaan College."
              )}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link href="/courses"
                  className="px-10 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg flex items-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] transition-shadow">
                  {t("Explore Courses", "استكشف الدورات", "Sahmi Koorsooyinka")}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link href="/ai-tutor"
                  className="px-10 py-4 rounded-full bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-violet-500/40 text-violet-300 font-bold text-lg flex items-center gap-2 hover:bg-violet-600/30 transition-colors">
                  <Bot className="w-5 h-5" />
                  {t("Try AI Tutor", "جرّب المعلم الذكي", "AI Bare Tijaabi")}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link href="/access-code"
                  className="px-10 py-4 rounded-full bg-white/5 border border-white/20 text-foreground font-bold text-lg hover:bg-white/10 transition-colors">
                  {t("Redeem Code", "استرداد الرمز", "Furo Koodhka")}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
