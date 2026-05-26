import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Link } from "wouter";
import {
  BookOpen, Users, Trophy, Zap, Globe, ShieldCheck, Star, ArrowRight,
  CheckCircle, Sparkles, Brain, Target, GraduationCap, Lightbulb,
  Code2, Briefcase, Palette, TrendingUp, Play, Award,
} from "lucide-react";

const CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay, ease: CUBIC },
  }),
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: CUBIC },
  }),
};

const HERO_PHRASES = [
  { en: "Learn with AI", ar: "تعلم بالذكاء الاصطناعي", so: "AI ku Baro" },
  { en: "Build Your Future", ar: "ابنِ مستقبلك", so: "Mustaqbalkaaga Dhis" },
  { en: "Master Modern Skills", ar: "أتقن المهارات الحديثة", so: "Xirfadaha Casriga Soo Xifdiso" },
  { en: "Study Anywhere", ar: "ادرس في أي مكان", so: "Meel kasta ka Baro" },
  { en: "Learn Without Limits", ar: "تعلم بلا حدود", so: "Xuduud La'aan Baro" },
];

const FEATURED_CURRICULUM = [
  { title: "English Beginner", titleAr: "إنجليزية مبتدئ", img: "https://images.unsplash.com/photo-1546521343-4eb2c01aa44b?w=400&q=80", level: "Beginner", students: "2,847", rating: "4.9", href: "/curriculum" },
  { title: "Arabic Beginner", titleAr: "عربية مبتدئ", img: "https://images.unsplash.com/photo-1585079374502-415f8516dcc3?w=400&q=80", level: "Beginner", students: "3,412", rating: "4.9", href: "/curriculum" },
  { title: "Advanced Arabic & Quran", titleAr: "عربية متقدمة وقرآن", img: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&q=80", level: "Advanced", students: "987", rating: "4.9", href: "/curriculum" },
];

const FEATURED_SKILLS = [
  { title: "AI & Machine Learning", titleAr: "الذكاء الاصطناعي وتعلم الآلة", img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80", category: "AI & Tech", students: "4,231", rating: "4.9", href: "/courses" },
  { title: "Python Programming", titleAr: "برمجة بايثون", img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80", category: "Programming", students: "3,156", rating: "4.8", href: "/courses" },
  { title: "Freelancing Mastery", titleAr: "إتقان العمل الحر", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80", category: "Career", students: "2,891", rating: "4.8", href: "/courses" },
];

export default function Home() {
  const { t, language } = useLanguage();
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHeroIdx(i => (i + 1) % HERO_PHRASES.length), 2800);
    return () => clearInterval(id);
  }, []);

  const heroPhrase = HERO_PHRASES[heroIdx];
  const heroText = language === "ar" ? heroPhrase.ar : language === "so" ? heroPhrase.so : heroPhrase.en;

  const stats = [
    { value: "15K+", label: t("Active Students", "طالب نشط", "Ardayda Firfircoon") },
    { value: "12", label: t("Expert Courses", "دورة متخصصة", "Koorso Khubradi ah") },
    { value: "95%", label: t("Completion Rate", "معدل الإتمام", "Heerka Dhamaystirka") },
    { value: "4.9★", label: t("Average Rating", "متوسط التقييم", "Celceliska Qiimaynta") },
  ];

  const testimonials = [
    { name: "Ahmed Mohamed", role: t("English Student", "طالب الإنجليزية", "Ardayga Ingiriisiga"), content: t("Al-Bayaan College transformed my English in just 3 months. The AI assistant is like having a personal tutor 24/7.", "غيّرت كليّة البيان لغتي الإنجليزية في 3 أشهر فقط.", "Al-Bayaan College ayaa Ingiriiskayga ku baddalay 3 bilood gudahood."), stars: 5 },
    { name: "Faadumo Hassan", role: t("Arabic Student", "طالبة العربية", "Ardayda Carabiga"), content: t("The multi-language support is amazing. I could learn Arabic while reading in Somali!", "دعم اللغات المتعددة رائع. يمكنني تعلم العربية أثناء القراءة بالصومالية!", "Taageerada luuqadaha badan ayaa cajiib ah. Waxaan ku baran karay Carabiga anigoo Soomaali ku akhrinaayo!"), stars: 5 },
    { name: "Omar Abdullah", role: t("AI Course Student", "طالب دورة الذكاء الاصطناعي", "Ardayga Koorso AI"), content: t("The AI course helped me land a $50/hr freelancing job. Best investment I made this year!", "ساعدتني دورة الذكاء الاصطناعي في الحصول على وظيفة مستقلة بـ50 دولار/ساعة.", "Koorso AI-ga ayaa kaalmay in aan shaqo freelance $50/saacad helo."), stars: 5 },
  ];

  return (
    <div className="w-full bg-background">

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-16 px-4 text-center overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/12 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        {/* Floating dots decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-blue-400/30 rounded-full"
              style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ y: [0, -15, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto w-full space-y-6">
          {/* Badge */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary"
          >
            <Sparkles className="w-4 h-4" />
            {t("Al-Bayaan College — AI-Powered Learning", "كلية البيان — التعلم بالذكاء الاصطناعي", "Kulliyadda Al-Bayaan — Waxbarasho AI ah")}
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
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
              "A premium AI-powered college — study academic curriculum or learn modern career skills in English, Arabic & Somali.",
              "كلية متميزة بالذكاء الاصطناعي — ادرس المنهج الأكاديمي أو تعلم مهارات مهنية حديثة.",
              "Kulliyo heer sare ah oo AI ah — baro manhajka cilmiga ama xirfadaha xirfadlaha casriga."
            )}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0.3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/curriculum"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.55)] transition-shadow"
              >
                <GraduationCap className="w-5 h-5" />
                {t("School & University", "المدرسة والجامعة", "Dugsi & Jaamacad")}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/courses"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/20 text-foreground font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                <Lightbulb className="w-5 h-5" />
                {t("Skills & Courses", "المهارات والدورات", "Xirfadaha & Koorsooyinka")}
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0.4}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-sm text-muted-foreground"
          >
            {[
              t("AI-assisted learning", "تعلم بمساعدة الذكاء الاصطناعي", "Waxbarasho AI la caawiso"),
              t("Certificate included", "الشهادة مشمولة", "Shahaadada ku jirta"),
              t("Lifetime access", "وصول مدى الحياة", "Galitaan weligeed ah"),
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

      {/* ── TWO LEARNING PATHS ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 w-full">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          custom={0}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-400 mb-4">
            <BookOpen className="w-4 h-4" />
            {t("Choose Your Learning Path", "اختر مسار تعلمك", "Dooro Wadada Waxbarashadaada")}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            {t("Two Paths to", "مساران نحو", "Laba Jid oo u Hogaaminaya")}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {t("Your Success", "نجاحك", "Guulshaada")}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            {t("Whether you want structured academic learning or modern career skills — we have the perfect path for you.", "سواء أردت التعلم الأكاديمي المنظم أو المهارات المهنية الحديثة — لدينا المسار المثالي لك.", "Haddaad rabto waxbarasho cilmiyeed nidaamsan ama xirfadaha xirfadlaha casriga — wadada saxda ah waa innaga.")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Path 1: Curriculum */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariant}
            custom={0}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 to-indigo-600/5 p-8 cursor-pointer group"
          >
            {/* Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[60px] group-hover:bg-blue-500/20 transition-all duration-500" />

            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs font-bold mb-3 border border-blue-500/20">
                {t("Section 1", "القسم الأول", "Qaybta 1")}
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-foreground mb-2">
                {t("School & University", "المدرسة والجامعة", "Dugsi & Jaamacad")}
              </h3>
              <p className="text-sm font-medium text-blue-400 mb-4 font-mono">
                {t("Manhajka School-ka iyo Jaamacadaha", "منهج المدارس والجامعات", "Manhajka School-ka iyo Jaamacadaha")}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {t("Structured academic curriculum covering school subjects, university programs, English, and Arabic at every level. Perfect for students and graduates.", "منهج أكاديمي منظم يغطي مواد المدرسة والبرامج الجامعية والإنجليزية والعربية.", "Manhaj cilmiyeed nidaamsan oo daboolaya maaddooyinka dugsia, barnaamijyada jaamacadda, Ingiriisiga, iyo Carabiga.")}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-6">
                {[
                  t("School Subjects", "المواد الدراسية", "Maaddooyinka Dugsia"),
                  t("University Programs", "البرامج الجامعية", "Barnaamijyada Jaamacadda"),
                  t("English Learning", "تعلم الإنجليزية", "Barasho Ingiriisi"),
                  t("Arabic Learning", "تعلم العربية", "Barasho Carabi"),
                  t("Certificates", "الشهادات", "Shahaadooyinka"),
                  t("All Levels", "جميع المستويات", "Dhammaan Heerarka"),
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <Link
                href="/curriculum"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all group-hover:gap-3"
              >
                {t("Explore Curriculum", "استكشف المنهج", "Sahmiga Manhajka")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Path 2: Skills */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariant}
            custom={1}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-600/10 to-pink-600/5 p-8 cursor-pointer group"
          >
            {/* Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[60px] group-hover:bg-purple-500/20 transition-all duration-500" />

            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(139,92,246,0.4)]">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 text-xs font-bold mb-3 border border-purple-500/20">
                {t("Section 2", "القسم الثاني", "Qaybta 2")}
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-foreground mb-2">
                {t("Courses & New Skills", "الدورات والمهارات الجديدة", "Koorsooyinka & Xirfadaha Cusub")}
              </h3>
              <p className="text-sm font-medium text-purple-400 mb-4 font-mono">
                {t("Hel Courses iyo Skills Cusub", "دورات ومهارات جديدة", "Hel Courses iyo Skills Cusub")}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {t("AI, programming, design, business, freelancing and career skills. Build profitable skills, earn online, and grow your career in the digital world.", "الذكاء الاصطناعي والبرمجة والتصميم والأعمال والعمل الحر. بناء مهارات مربحة والكسب عبر الإنترنت.", "AI, barnaamijka, naqshadeynta, ganacsiga, freelancing iyo xirfadaha xirfadlaha. Dhis xirfadaha faa'iidada leh.")}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-6">
                {[
                  t("AI & Technology", "الذكاء الاصطناعي والتقنية", "AI & Teknoloji"),
                  t("Programming", "البرمجة", "Barnaamijka"),
                  t("Design & Creativity", "التصميم والإبداع", "Naqshadeynta"),
                  t("Business & Finance", "الأعمال والمال", "Ganacsiga"),
                  t("Freelancing", "العمل الحر", "Freelancing"),
                  t("Self-Development", "التطوير الذاتي", "Is-Horumarinta"),
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all group-hover:gap-3"
              >
                {t("Explore Skills", "استكشف المهارات", "Sahmiga Xirfadaha")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Curriculum Courses ── */}
      <section className="py-16 bg-card/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-blue-400 uppercase tracking-wide">{t("School & University", "المدرسة والجامعة", "Dugsi & Jaamacad")}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground">{t("Featured Curriculum", "المنهج المميز", "Manhajka Muuqda")}</h2>
            </div>
            <Link href="/curriculum" className="flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all">
              {t("View all", "عرض الكل", "Dhamaan arag")} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURED_CURRICULUM.map((course, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariant}
                custom={i}
                whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl bg-card border border-border hover:border-blue-500/40 overflow-hidden group transition-all"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={course.img}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-blue-600/90 text-white text-xs font-bold">{course.level}</div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full text-white text-xs">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {course.rating}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground mb-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.students}</span>
                    <Link href={course.href} className="flex items-center gap-1 text-primary font-medium hover:gap-1.5 transition-all">
                      {t("Enroll", "انضم", "Diiwaan")} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Skills Courses ── */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          custom={0}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-400 uppercase tracking-wide">{t("Courses & Skills", "الدورات والمهارات", "Koorsooyinka & Xirfadaha")}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground">{t("Popular Skills Courses", "الدورات الشعبية للمهارات", "Koorsooyinka Xirfadaha ee Caanka ah")}</h2>
          </div>
          <Link href="/courses" className="flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all">
            {t("View all", "عرض الكل", "Dhamaan arag")} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURED_SKILLS.map((course, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariant}
              custom={i}
              whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl bg-card border border-border hover:border-purple-500/40 overflow-hidden group transition-all"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.img}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-purple-600/90 text-white text-xs font-bold">{course.category}</div>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full text-white text-xs">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {course.rating}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-foreground mb-2 group-hover:text-purple-400 transition-colors">{course.title}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.students}</span>
                  <Link href={course.href} className="flex items-center gap-1 text-primary font-medium hover:gap-1.5 transition-all">
                    {t("Enroll", "انضم", "Diiwaan")} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
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
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
              {t("Everything you need to", "كل ما تحتاجه", "Waxkasta oo aad u baahan tahay")}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {t("succeed in learning", "النجاح في التعلم", "in aad ku guulaysato waxbarashadaada")}
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Brain, color: "from-blue-500 to-blue-600", bg: "bg-blue-500/10 border-blue-500/20", title: t("AI-Powered Learning", "التعلم بالذكاء الاصطناعي", "Waxbarasho AI ah"), desc: t("Our AI assistant helps you understand complex topics instantly.", "مساعدنا الذكي يساعدك على فهم المواضيع المعقدة فوراً.", "Kaaliyahaaga AI-ga ayaa kaa caawiya.") },
              { icon: Globe, color: "from-purple-500 to-purple-600", bg: "bg-purple-500/10 border-purple-500/20", title: t("Multi-language Support", "دعم متعدد اللغات", "Taageero Luuqaddo Badan"), desc: t("Learn in English, Arabic, or Somali — your choice.", "تعلم بالإنجليزية أو العربية أو الصومالية.", "Ku baro Ingiriisi, Carabi, ama Soomaali.") },
              { icon: Award, color: "from-yellow-500 to-orange-500", bg: "bg-yellow-500/10 border-yellow-500/20", title: t("Verified Certificates", "شهادات موثقة", "Shahaadooyinka La xaqiijiyay"), desc: t("Download premium PDF certificates upon course completion.", "تنزيل شهادات PDF متميزة عند اكتمال الدورة.", "Soo degso shahaadooyinka PDF ee heer sarena marka aad koorso dhamayso.") },
              { icon: Target, color: "from-green-500 to-emerald-600", bg: "bg-green-500/10 border-green-500/20", title: t("Structured Curriculum", "منهج منظم", "Manhajka Nidaamsan"), desc: t("Step-by-step lessons designed for real-world results.", "دروس خطوة بخطوة مصممة لنتائج حقيقية.", "Casharro tallaabooyinka ku saleysan.") },
              { icon: Zap, color: "from-pink-500 to-rose-500", bg: "bg-pink-500/10 border-pink-500/20", title: t("Interactive Quizzes", "اختبارات تفاعلية", "Imtixaanno Isdhexgal ah"), desc: t("Reinforce your learning with quizzes after every lesson.", "عزز تعلمك باختبارات بعد كل درس.", "Xooji waxbarashadaada imtixaannada.") },
              { icon: TrendingUp, color: "from-cyan-500 to-teal-500", bg: "bg-cyan-500/10 border-cyan-500/20", title: t("Progress Analytics", "تحليلات التقدم", "Falanqaynta Horumarka"), desc: t("Track your learning streaks, scores, and achievements.", "تتبع مستوى تعلمك ودرجاتك وإنجازاتك.", "Raac wadooyinkaaga waxbarasho, dhibcahaaga, iyo guulaha.") },
            ].map((feature, i) => (
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
        </div>
      </section>

      {/* ── Category Icons Row ── */}
      <section className="py-14 max-w-7xl mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          custom={0}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-black text-foreground mb-3">
            {t("Explore by Category", "تصفح حسب الفئة", "U-Sahminta Nooca")}
          </h2>
        </motion.div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: GraduationCap, label: t("English", "الإنجليزية", "Ingiriisi"), color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", href: "/curriculum" },
            { icon: BookOpen, label: t("Arabic", "العربية", "Carabi"), color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", href: "/curriculum" },
            { icon: Brain, label: t("AI & ML", "الذكاء الاصطناعي", "AI & ML"), color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", href: "/courses" },
            { icon: Code2, label: t("Programming", "البرمجة", "Barnaamijka"), color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", href: "/courses" },
            { icon: Briefcase, label: t("Business", "الأعمال", "Ganacsiga"), color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", href: "/courses" },
            { icon: Palette, label: t("Design", "التصميم", "Naqshadeynta"), color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20", href: "/courses" },
            { icon: TrendingUp, label: t("Freelancing", "العمل الحر", "Freelancing"), color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", href: "/courses" },
            { icon: Zap, label: t("Self-Dev", "التطوير الذاتي", "Is-Horumar"), color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", href: "/courses" },
          ].map((cat, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariant}
              custom={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href={cat.href}
                className={`flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border ${cat.bg} cursor-pointer min-w-[90px] transition-all hover:shadow-lg`}
              >
                <cat.icon className={`w-6 h-6 ${cat.color}`} />
                <span className="text-xs font-semibold text-foreground">{cat.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
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
              {t("Loved by students worldwide", "يحبه الطلاب في كل مكان", "Ardaydu adduunka oo dhan waxay jeclayaan")}
            </h2>
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
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          custom={0}
          className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-12"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-blue-500/20 rounded-full blur-[60px]" />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-[0_0_40px_rgba(59,130,246,0.5)]">
              <Play className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              {t("Start learning today", "ابدأ التعلم اليوم", "Maanta bilow waxbarasho")}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {t("Join 15,000+ students already learning at Al-Bayaan College. One-time payment, lifetime access.", "انضم إلى أكثر من 15,000 طالب يتعلمون في كلية البيان. دفعة واحدة، وصول مدى الحياة.", "Ku biir 15,000+ ardayda hore waxba u baranaya Kulliyadda Al-Bayaan. Hal mar bixi, weligeed gal.")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link href="/curriculum" className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] transition-shadow flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  {t("School & University", "المدرسة والجامعة", "Dugsi & Jaamacad")}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link href="/courses" className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] transition-shadow flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  {t("Skills & Courses", "المهارات والدورات", "Xirfadaha & Koorsooyinka")}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
