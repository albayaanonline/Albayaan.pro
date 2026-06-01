import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Link } from "wouter";
import {
  BookOpen, Users, Trophy, Zap, Globe, ShieldCheck, Star, ArrowRight,
  CheckCircle, Sparkles, Brain, Target, GraduationCap, Lightbulb,
  Code2, Briefcase, Palette, TrendingUp, FlaskConical, Calculator,
  Play, Award, Bot, MessageCircle, Flame, Medal, ChevronRight,
  Atom, BookMarked, Languages, Music, Mic,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: d, ease: EASE } }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (d = 0) => ({ opacity: 1, transition: { duration: 0.6, delay: d } }),
};

const HERO_PHRASES = [
  { en: "Master English & Arabic",          ar: "أتقن الإنجليزية والعربية",          so: "Ingiriisi & Carabi Soo Xifdiso" },
  { en: "Build Your Future Today",           ar: "ابنِ مستقبلك اليوم",               so: "Maanta Mustaqbalkaaga Dhis" },
  { en: "Learn with AI Intelligence",        ar: "تعلم بالذكاء الاصطناعي",           so: "AI ku Baro" },
  { en: "Study School & University",         ar: "ادرس المدرسة والجامعة",            so: "Dugsiga & Jaamacadda Baro" },
  { en: "Master Modern Skills",              ar: "أتقن المهارات الحديثة",            so: "Xirfadaha Casriga Soo Xifdiso" },
];

const SCHOOL_SUBJECTS = [
  { icon: Calculator,  label: "Mathematics",      labelAr: "الرياضيات",      labelSo: "Xisaabta",        color: "from-blue-500 to-cyan-400",    bg: "bg-blue-500/10",    glow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]" },
  { icon: FlaskConical,label: "Science",          labelAr: "العلوم",          labelSo: "Sayniska",        color: "from-green-500 to-emerald-400",bg: "bg-green-500/10",   glow: "hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"  },
  { icon: Globe,       label: "English",          labelAr: "الإنجليزية",      labelSo: "Ingiriisiga",     color: "from-indigo-500 to-blue-400",  bg: "bg-indigo-500/10",  glow: "hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]" },
  { icon: BookMarked,  label: "Arabic",           labelAr: "اللغة العربية",   labelSo: "Carabiga",        color: "from-amber-500 to-yellow-400", bg: "bg-amber-500/10",   glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]" },
  { icon: Atom,        label: "Physics",          labelAr: "الفيزياء",        labelSo: "Physics",         color: "from-purple-500 to-violet-400",bg: "bg-purple-500/10",  glow: "hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]" },
  { icon: Lightbulb,   label: "Chemistry",        labelAr: "الكيمياء",        labelSo: "Kiimikada",       color: "from-orange-500 to-red-400",   bg: "bg-orange-500/10",  glow: "hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]" },
  { icon: BookOpen,    label: "Biology",          labelAr: "الأحياء",         labelSo: "Biology",         color: "from-teal-500 to-green-400",   bg: "bg-teal-500/10",    glow: "hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]" },
  { icon: Users,       label: "Islamic Studies",  labelAr: "الدراسات الإسلامية",labelSo: "Cilmiga Islaamiga",color:"from-yellow-500 to-amber-400", bg: "bg-yellow-500/10", glow: "hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]"  },
  { icon: Globe,       label: "Geography",        labelAr: "الجغرافيا",       labelSo: "Juqraafiga",      color: "from-cyan-500 to-blue-400",    bg: "bg-cyan-500/10",    glow: "hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"  },
  { icon: BookOpen,    label: "History",          labelAr: "التاريخ",         labelSo: "Taariikhda",      color: "from-rose-500 to-pink-400",    bg: "bg-rose-500/10",    glow: "hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]"  },
  { icon: Languages,   label: "Somali",           labelAr: "الصومالية",       labelSo: "Soomaali",        color: "from-sky-500 to-cyan-400",     bg: "bg-sky-500/10",     glow: "hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]" },
  { icon: Code2,       label: "Computer Sci.",    labelAr: "علوم الحاسوب",   labelSo: "Sayniska CS",     color: "from-violet-500 to-purple-400",bg: "bg-violet-500/10",  glow: "hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]" },
];

const SKILLS_LIST = [
  { icon: Brain,      label: "AI & Machine Learning", labelAr: "الذكاء الاصطناعي",  labelSo: "AI & ML",           color: "from-violet-500 to-blue-500" },
  { icon: Code2,      label: "Python Programming",     labelAr: "برمجة Python",      labelSo: "Barnaamijka Python", color: "from-yellow-500 to-green-500" },
  { icon: Globe,      label: "Web Development",        labelAr: "تطوير الويب",       labelSo: "Horumarinta Web",   color: "from-blue-500 to-cyan-400" },
  { icon: Palette,    label: "Graphic Design",         labelAr: "التصميم الجرافيكي", labelSo: "Naqshadeynta",      color: "from-pink-500 to-rose-400" },
  { icon: Briefcase,  label: "Digital Marketing",      labelAr: "التسويق الرقمي",    labelSo: "Suuqgeynta",        color: "from-green-500 to-teal-400" },
  { icon: TrendingUp, label: "Freelancing",            labelAr: "العمل الحر",         labelSo: "Freelancing",       color: "from-orange-500 to-amber-400" },
  { icon: Mic,        label: "Public Speaking",        labelAr: "الخطابة العامة",    labelSo: "Hadlidda Dadweynaha",color:"from-purple-500 to-pink-400" },
  { icon: Music,      label: "Tajweed & Qur'an",       labelAr: "التجويد والقرآن",   labelSo: "Tajwiidka & Qur'aan",color:"from-amber-500 to-yellow-400" },
];

const AI_FEATURES = [
  { icon: "🤖", title: "AI Tutor",            titleAr: "المعلم الذكي",           titleSo: "Bare AI-ga",          desc: "24/7 personalized AI assistant that answers your questions instantly.",                   descAr: "مساعد AI شخصي متاح على مدار الساعة.",                  descSo: "Kaaliye AI ah oo joogto ah oo su'aalahaaga si degdeg ah u jawaaba." },
  { icon: "📝", title: "AI Quiz Generator",   titleAr: "مولد الاختبارات الذكي",  titleSo: "Abuuraha Imtixaanka", desc: "Automatically generates quizzes after each lesson to test your knowledge.",               descAr: "يولد اختبارات تلقائية بعد كل درس.",                    descSo: "Imtixaanad si toos ah uga sameeya ka dib casharka." },
  { icon: "✍️", title: "AI Lesson Summaries", titleAr: "ملخصات الدروس الذكية",   titleSo: "Koobbiyada AI",       desc: "Instant, clear summaries of every lesson so you never miss the key points.",               descAr: "ملخصات فورية وواضحة لكل درس.",                         descSo: "Koobbiyada casharka si deg-deg ah." },
  { icon: "🌍", title: "AI Translation",      titleAr: "الترجمة الذكية",          titleSo: "Turjumaada AI",       desc: "Translate any lesson or word into English, Arabic, or Somali in real time.",               descAr: "ترجمة أي درس أو كلمة في الوقت الحقيقي.",               descSo: "U turjum casharka Ingiriisi, Carabi, ama Soomaali." },
  { icon: "🎯", title: "Personalized Paths",  titleAr: "مسارات مخصصة",           titleSo: "Dariiqdaha Gaarka",   desc: "AI recommends the best next course based on your learning history and goals.",             descAr: "الذكاء الاصطناعي يوصي بأفضل دورة تالية.",              descSo: "AI wuxuu kugula talinayaa koorso xigta." },
  { icon: "🔊", title: "Pronunciation AI",    titleAr: "نطق الذكاء الاصطناعي",   titleSo: "Dhawaaqa AI",         desc: "Get instant pronunciation feedback on English & Arabic words.",                           descAr: "احصل على ملاحظات فورية على نطقك.",                     descSo: "Hel faalladaada dhawaaqa si degdeg ah." },
];

const TESTIMONIALS = [
  { name: "Ahmed Mohamed",  country: "🇸🇴", role: "English Student",    content: "Albayaan.pro transformed my English in just 3 months. The AI tutor is like having a private teacher 24/7.", stars: 5 },
  { name: "Faadumo Hassan", country: "🇸🇴", role: "Arabic Learner",      content: "I went from zero Arabic to reading Quran fluently. The lessons are beautiful and the community is supportive.", stars: 5 },
  { name: "Omar Abdullah",  country: "🇬🇧", role: "Python Developer",    content: "Finished the Python course in 8 weeks and landed a $3,000/month freelancing job. Best investment ever!", stars: 5 },
  { name: "Nasra Ali",      country: "🇸🇴", role: "School Student",      content: "I use Albayaan.pro to study for my school exams. The curriculum is exactly what we learn in class!", stars: 5 },
  { name: "Yusuf Ibrahim",  country: "🇺🇸", role: "AI Entrepreneur",     content: "The AI Mastery course gave me the skills to launch my own AI agency. Revenue hit $10K in 4 months.", stars: 5 },
];

function ParticleOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Reduced-size orbs — no overflow beyond section bounds */}
      <div className="absolute top-[5%] left-[10%] w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] rounded-full bg-blue-600/10 blur-[60px] sm:blur-[90px] animate-glow-pulse" />
      <div className="absolute top-[30%] right-[5%] w-[160px] h-[160px] sm:w-[320px] sm:h-[320px] rounded-full bg-purple-600/8 blur-[50px] sm:blur-[80px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
      <div className="hidden sm:block absolute bottom-[10%] left-[30%] w-[280px] h-[280px] rounded-full bg-cyan-600/6 blur-[70px] animate-glow-pulse" style={{ animationDelay: "3s" }} />
      {/* Small decorative dots — desktop only to avoid mobile GPU load */}
      <div className="hidden sm:block absolute top-[30%] left-[10%] w-5 h-5 opacity-15 animate-float text-blue-400" style={{ animationDelay: "0s" }}>✦</div>
      <div className="hidden sm:block absolute top-[60%] right-[8%] w-4 h-4 opacity-10 animate-float text-purple-400" style={{ animationDelay: "2s" }}>✦</div>
    </div>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1400;
    const step = (to / duration) * 16;
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [inView, to]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const { t, language } = useLanguage();
  const [heroIdx, setHeroIdx] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHeroIdx(i => (i + 1) % HERO_PHRASES.length), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(id);
  }, []);

  const heroText = language === "ar" ? HERO_PHRASES[heroIdx].ar :
                   language === "so" ? HERO_PHRASES[heroIdx].so :
                   HERO_PHRASES[heroIdx].en;

  const getLabel = (item: any) => language === "ar" ? item.labelAr : language === "so" ? item.labelSo : item.label;

  return (
    <div className="w-full bg-background overflow-x-hidden">

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-20 pb-20 px-4 text-center overflow-hidden">
        <ParticleOrbs />

        <div className="relative z-10 max-w-5xl mx-auto w-full space-y-7">

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary mx-auto">
            <Sparkles className="w-4 h-4 shrink-0 animate-float" />
            {t("Next-Gen AI Learning for Somali Students", "منصة تعلم ذكي للطلاب الصوماليين", "Waxbarasho AI ah oo Casri ah oo Ardayda Soomaalida")}
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.08}>
            <AnimatePresence mode="wait">
              <motion.h1 key={heroIdx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="text-3xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tight shimmer-text break-words">
                {heroText}
              </motion.h1>
            </AnimatePresence>
            <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={0.15}
              className="text-xl sm:text-3xl md:text-5xl font-black text-foreground mt-2">
              {t("at the Speed of AI", "بسرعة الذكاء الاصطناعي", "Xawliga AI ah")}
            </motion.p>
          </motion.div>

          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={0.22}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t(
              "A cinematic AI-powered platform for school curriculum, skills mastery, and career growth — in English, Arabic & Somali.",
              "منصة تعليمية سينمائية مدعومة بالذكاء الاصطناعي للمنهج المدرسي والمهارات والنمو المهني.",
              "Madal waxbarasho oo AI ah oo heer sarena ah: manhajka dugsiga, xirfadaha, iyo kobocda shaqada."
            )}
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.3}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 w-full max-w-xl mx-auto sm:max-w-none">
            <Link href="/courses"
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-shadow">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              {t("Explore Courses", "استكشف الدورات", "Sahmi Koorsooyinka")}
            </Link>
            <Link href="/auth/register"
              className="px-6 py-3.5 rounded-full bg-card border border-border text-foreground font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:border-primary/40 transition-all">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 shrink-0" />
              {t("Start Learning Free", "ابدأ التعلم مجاناً", "Bilaash Bilow")}
            </Link>
            <Link href="/ai-tutor"
              className="px-6 py-3.5 rounded-full bg-violet-50 dark:bg-violet-600/15 border border-violet-400/50 dark:border-violet-500/30 text-violet-700 dark:text-violet-300 font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-violet-100 dark:hover:bg-violet-600/25 transition-all">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              {t("Try AI Tutor", "جرب المعلم الذكي", "AI Bare Tijaabi")}
            </Link>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.38}
            className="flex flex-wrap items-center justify-center gap-5 pt-2 text-sm text-muted-foreground">
            {[
              t("No subscription", "بدون اشتراك", "Rumeyn la'aane"),
              t("Lifetime access", "وصول مدى الحياة", "Weligeed galitaan"),
              t("AI-powered", "مدعوم بالذكاء", "AI la taageero"),
              t("3 Languages", "3 لغات", "3 Luuqadood"),
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" /> {item}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ STATS ══════════════════ */}
      <section className="border-y border-border/50 bg-card/30 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { to: 25000, suffix: "+", label: t("Active Students", "طالب نشط", "Ardayda Firfircoon") },
            { to: 18,    suffix: "+", label: t("Expert Courses",  "دورة متخصصة", "Koorso Xirfadeed") },
            { to: 95,    suffix: "%", label: t("Completion Rate", "معدل الإتمام", "Heerka Dhamaystirka") },
            { to: 49,    suffix: "",  label: t("4.9★ Rating",     "تقييم 4.9 نجوم", "Qiimaynta 4.9 ★") },
          ].map((s, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i * 0.08} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-1">
                <CountUp to={s.to} suffix={s.suffix} />
              </div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════ SCHOOL CURRICULUM ══════════════════ */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp} custom={0} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-400 mb-4">
            <GraduationCap className="w-4 h-4" />
            {t("Section 1 — School & University", "القسم الأول — المدرسة والجامعة", "Qaybta 1 — Dugsiga & Jaamacadda")}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 leading-tight">
            {t("Complete School", "منهج مدرسي", "Manhaj Dugsi")}
            <span className="shimmer-text mx-3">{t("Curriculum", "شامل", "Buuxa")}</span>
            {t("Online", "عبر الإنترنت", "Online ah")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            {t(
              "Primary to Secondary school subjects. Physics, Chemistry, Biology, Math, English, Arabic, Islamic Studies, and more — all structured, quizzed, and certified.",
              "مواد المرحلتين الابتدائية والثانوية: الفيزياء والكيمياء والأحياء والرياضيات وأكثر.",
              "Xaaladaha Dugsiga Hoose ilaa Sare: Physics, Chemistry, Biology, Math, iyo wax badan."
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 mb-10">
          {SCHOOL_SUBJECTS.map((subj, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i * 0.04}
              whileHover={{ y: -4, scale: 1.04 }}
              className={`p-2.5 sm:p-4 rounded-2xl ${subj.bg} border border-white/8 text-center flex flex-col items-center gap-1.5 sm:gap-2 cursor-pointer transition-all ${subj.glow}`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${subj.color} flex items-center justify-center shadow-lg`}>
                <subj.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-foreground leading-tight">{getLabel(subj)}</span>
            </motion.div>
          ))}
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.3}
          className="flex justify-center">
          <Link href="/curriculum">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-shadow">
              <GraduationCap className="w-5 h-5" />
              {t("Browse Full Curriculum", "تصفح المنهج الكامل", "Baadh Manhajka Oo Dhan")}
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* ══════════════════ SKILLS ACADEMY ══════════════════ */}
      <section className="py-24 bg-card/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp} custom={0} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-medium text-purple-400 mb-4">
              <Lightbulb className="w-4 h-4" />
              {t("Section 2 — Skills Academy", "القسم الثاني — أكاديمية المهارات", "Qaybta 2 — Akademiyada Xirfadaha")}
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 leading-tight">
              {t("Modern Skills for the", "مهارات حديثة", "Xirfadaha Casriga")}
              <span className="shimmer-text ml-3">{t("AI Era", "للعصر الذكي", "AI Wakhtiga")}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
              {t(
                "AI, Python, Web Dev, Design, Marketing, Freelancing, Public Speaking, Tajweed & more — everything you need to thrive in 2026.",
                "AI والبرمجة وتطوير الويب والتصميم والتسويق والعمل الحر وأكثر.",
                "AI, Python, Web Dev, Naqshadeynta, Suuqgeynta, Freelancing, iyo wax badan."
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {SKILLS_LIST.map((skill, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i * 0.06}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-5 rounded-2xl bg-card border border-white/10 hover:border-purple-500/30 hover:shadow-[0_0_25px_rgba(139,92,246,0.12)] transition-all flex items-center gap-3 cursor-pointer group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                  <skill.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-foreground">{getLabel(skill)}</span>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.4}
            className="flex justify-center">
            <Link href="/courses">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-shadow">
                <Lightbulb className="w-5 h-5" />
                {t("Explore All Skills", "استكشف جميع المهارات", "Dhammaan Xirfadaha Sahmi")}
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ AI FEATURES ══════════════════ */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp} custom={0} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm font-medium text-violet-400 mb-4">
            <Brain className="w-4 h-4" />
            {t("AI-Powered Learning", "التعلم بالذكاء الاصطناعي", "Waxbarasho AI ah")}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            {t("6 Powerful AI Tools", "6 أدوات ذكاء اصطناعي", "6 Qalab AI oo Xoog leh")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Every course is supercharged with AI tools that make learning 10x faster and more effective.",
              "كل دورة مزودة بأدوات ذكاء اصطناعي تجعل التعلم أسرع بـ 10 مرات.",
              "Koorso kasta waxaa ku xidhan qalab AI ah oo waxbarasho 10x ka dhaqsiya."
            )}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AI_FEATURES.map((f, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i * 0.07}
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl bg-card border border-white/10 hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(124,58,237,0.12)] transition-all">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-black text-foreground mb-2">{language === "ar" ? f.titleAr : language === "so" ? f.titleSo : f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{language === "ar" ? f.descAr : language === "so" ? f.descSo : f.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.5}
          className="flex justify-center mt-10">
          <Link href="/ai-tutor">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-violet-500/40 text-violet-300 font-bold hover:bg-violet-600/30 transition-all">
              <Bot className="w-5 h-5" />
              {t("Try AI Tutor Free", "جرب المعلم الذكي مجاناً", "Bilaash AI Bare Tijaabi")}
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* ══════════════════ GAMIFICATION ══════════════════ */}
      <section className="py-24 bg-card/20 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">
                {t("Gamified Learning", "التعلم المُلعَّب", "Ciyaargelinta Waxbarasho")}
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6 leading-tight">
                {t("Learning That's", "التعلم الذي", "Waxbarasho")}
                <span className="shimmer-text ml-2">{t("Addictive", "مُدمِن", "Xiiseeya")}</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {t(
                  "Earn XP points, maintain streaks, unlock badges, compete on the leaderboard, and get rewarded for every lesson you complete.",
                  "اكسب نقاط XP، حافظ على الاستمرارية، افتح الشارات، تنافس في لوحة التصنيف.",
                  "Hel dhibcaha XP, joogso, fur astaamaha, tartam jadwalka, oo abaal-marin u hel casharka."
                )}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Zap,    label: "XP Points",      val: "500 XP / course",  color: "text-purple-400", bg: "bg-purple-500/10" },
                  { icon: Flame,  label: "Daily Streak",   val: "10 XP / day",      color: "text-orange-400", bg: "bg-orange-500/10" },
                  { icon: Trophy, label: "Leaderboard",    val: "Top 10 Ranking",   color: "text-yellow-400", bg: "bg-yellow-500/10" },
                  { icon: Medal,  label: "Badges",         val: "6+ Achievements",  color: "text-cyan-400",   bg: "bg-cyan-500/10" },
                ].map((g, i) => (
                  <div key={i} className={`p-4 rounded-2xl ${g.bg} border border-white/10 flex items-center gap-3`}>
                    <g.icon className={`w-5 h-5 ${g.color} shrink-0`} />
                    <div>
                      <p className="text-xs font-bold text-foreground">{g.label}</p>
                      <p className="text-xs text-muted-foreground">{g.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.2}
              className="relative p-6 rounded-3xl bg-card border border-white/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/8 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-black">A</div>
                  <div>
                    <p className="font-black text-foreground text-sm">Ahmed Mohamed</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Flame className="w-3 h-3 text-orange-400" /> 14 day streak
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Level 8</p>
                    <p className="text-xs text-muted-foreground">3,750 XP</p>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-white/5 mb-1 overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "75%" }} viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                </div>
                <p className="text-xs text-muted-foreground mb-5">3,750 / 4,000 XP to Level 9</p>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {["🚀","📚","🎯","🏆","⚡","🌟"].map((badge, i) => (
                    <div key={i} className={`text-center p-3 rounded-xl border text-xl ${i < 4 ? "bg-yellow-500/10 border-yellow-500/20" : "bg-white/3 border-white/8 opacity-40 grayscale"}`}>
                      {badge}
                    </div>
                  ))}
                </div>
                <Link href="/leaderboard" className="block">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 flex items-center gap-2 hover:border-yellow-400/40 transition-colors">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-bold text-yellow-400">#3 on Leaderboard</span>
                    <ChevronRight className="w-3 h-3 text-yellow-400 ml-auto" />
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="py-24 max-w-6xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-400 mb-4">
            <Star className="w-4 h-4 fill-green-400" />
            {t("Student Success Stories", "قصص نجاح الطلاب", "Sheekooyin Guusha Ardayda")}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground">
            {t("25,000+ Students Can't Be Wrong", "25,000+ طالب لا يمكن أن يكونوا مخطئين", "25,000+ Arday Waxay Ku Hambalyeynayaan")}
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i * 0.08}
              className="p-6 rounded-2xl bg-card border border-white/10 hover:border-green-500/20 transition-all flex flex-col">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.stars)].map((_, s) => <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5 italic">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                  {t.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <span className="text-base">{t.country}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════ PRICING PREVIEW ══════════════════ */}
      <section className="py-24 bg-card/20 border-y border-border/50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm font-medium text-amber-400 mb-4">
              <Zap className="w-4 h-4" />
              {t("Simple Pricing", "أسعار بسيطة", "Qiimo Fudud")}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
              {t("Invest in Your Future", "استثمر في مستقبلك", "Mustaqbalkaaga ka Maalgeli")}
            </h2>
            <p className="text-muted-foreground">
              {t("Pay once. Learn forever. Zaad & Waafi accepted.", "ادفع مرة. تعلم إلى الأبد. Zaad وWaafi مقبولان.", "Hal mar bixi. Weligaa baro. Zaad & Waafi la aqbalaa.")}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: t("Starter", "المبتدئ", "Bilowga"),     price: "$15", desc: t("1 course · Lifetime access", "دورة واحدة · وصول مدى الحياة", "1 koorso · Weligeed"),       color: "from-blue-500 to-cyan-400",    popular: false },
              { name: t("Pro Bundle", "الحزمة الاحترافية", "Xidhmo Pro"), price: "$45", desc: t("3 courses · AI tutoring · Certificate", "3 دورات · تدريب AI · شهادة", "3 koorso · AI · Shahaado"), color: "from-purple-500 to-indigo-400", popular: true  },
              { name: t("All Access", "الوصول الكامل", "Dhammaan"),   price: "$99", desc: t("All courses · Forever · Priority support", "جميع الدورات · للأبد", "Dhammaan koorsooyinka"),     color: "from-amber-500 to-orange-400", popular: false },
            ].map((plan, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i * 0.1}
                whileHover={{ y: -6 }}
                className={`p-7 rounded-2xl relative overflow-hidden flex flex-col ${
                  plan.popular
                    ? "bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border-2 border-purple-500/50 shadow-[0_0_40px_rgba(139,92,246,0.2)]"
                    : "bg-card border border-white/10"
                }`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold rounded-bl-xl">
                    🔥 {t("Most Popular", "الأكثر شعبية", "Ugu Caansan")}
                  </div>
                )}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-black text-foreground mb-1">{plan.name}</h3>
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">{plan.price}</p>
                <p className="text-sm text-muted-foreground mb-6 flex-1">{plan.desc}</p>
                <Link href="/pricing">
                  <div className={`w-full py-3 rounded-xl text-sm font-bold text-center transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]"
                      : "bg-white/8 text-foreground hover:bg-white/12 border border-white/10"
                  }`}>
                    {t("Get Started", "ابدأ الآن", "Bilow Hadda")}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.4}
            className="mt-8 text-center">
            <Link href="/pricing" className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1">
              {t("View full pricing details", "عرض تفاصيل الأسعار الكاملة", "Fiiri faahfaahinta qiimaha oo buuxda")}
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ CTA BANNER ══════════════════ */}
      <section className="py-24 max-w-5xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="relative p-7 sm:p-10 md:p-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 text-center overflow-hidden">
          <div className="hidden sm:block absolute top-0 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="hidden sm:block absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10">
            <div className="text-5xl mb-4 animate-float">🚀</div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
              {t("Ready to Transform Your Life?", "هل أنت مستعد لتحويل حياتك؟", "Ma Diyaar u Tahay Noloshaada Baddalka?")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              {t(
                "Join 25,000+ Somali students already learning with AI on Albayaan.pro.",
                "انضم إلى أكثر من 25,000 طالب صومالي يتعلمون بالذكاء الاصطناعي.",
                "Ku biir 25,000+ arday Soomaali oo horey AI ku baranaya Albayaan.pro."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/register"
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] transition-shadow">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                {t("Join Now — Free", "انضم الآن — مجاناً", "Hadda Ku Biir — Bilaash")}
              </Link>
              <a href="https://wa.me/252656042512" target="_blank" rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-green-500/30 transition-colors">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
