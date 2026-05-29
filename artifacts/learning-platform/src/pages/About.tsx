import { motion } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  GraduationCap, Brain, Globe, Trophy, Users, Zap, Heart, Star,
  ArrowRight, CheckCircle, BookOpen, Target, Shield, Sparkles,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

const teamMembers = [
  { name: "Dr. Sarah Ahmed",        role: "Head of English Curriculum", avatar: "👩‍🏫", color: "from-blue-500 to-cyan-400" },
  { name: "Sheikh Abdullah Al-Farsi", role: "Arabic & Islamic Studies",  avatar: "👨‍🎓", color: "from-green-500 to-emerald-400" },
  { name: "Prof. Abdullahi Ahmed",   role: "Computer Science & AI",      avatar: "👨‍💻", color: "from-violet-500 to-purple-400" },
  { name: "Coach Nasra",             role: "Self-Development Expert",    avatar: "👩‍💼", color: "from-orange-500 to-amber-400" },
  { name: "Eng. Farhan Ali",         role: "Python & Tech Skills",      avatar: "👨‍🔧", color: "from-yellow-500 to-green-500" },
  { name: "Dr. Abdi Tech",           role: "AI & Machine Learning",      avatar: "🤖", color: "from-pink-500 to-rose-400" },
];

const values = [
  { icon: Heart,   title: "Student First",       desc: "Every decision we make starts with one question: does this help our students learn better?",          color: "text-rose-400",   bg: "bg-rose-500/10",   border: "border-rose-500/20" },
  { icon: Globe,   title: "Accessible for All",  desc: "Quality education shouldn't depend on where you live. We build for Somali students, everywhere.",     color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20" },
  { icon: Brain,   title: "AI-Powered Future",   desc: "We integrate cutting-edge AI to personalize learning and make education infinitely more effective.",   color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { icon: Shield,  title: "Trust & Quality",     desc: "Every course is carefully crafted, reviewed, and updated. We stand behind our certificates 100%.",    color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20" },
  { icon: Sparkles,"title": "Cinematic Experience", desc: "Learning should feel inspiring. We design every detail to make education feel premium and motivating.", color: "text-cyan-400",   bg: "bg-cyan-500/10",   border: "border-cyan-500/20" },
  { icon: Target,  title: "Real Results",        desc: "We measure success by student outcomes — jobs found, skills mastered, lives changed.",                color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20" },
];

const milestones = [
  { year: "2022", title: "Founded",           desc: "Albayaan.pro launched with 3 courses and a mission to serve Somali students worldwide." },
  { year: "2023", title: "10K Students",      desc: "Reached 10,000 active students across Somalia, Kenya, Ethiopia, and the diaspora." },
  { year: "2024", title: "AI Integration",    desc: "Launched the AI Tutor and personalized learning paths, powered by GPT-4." },
  { year: "2025", title: "25K+ Students",     desc: "Expanded to 18 courses, 6 languages of support, and 95% completion rates." },
  { year: "2026", title: "Full Platform",     desc: "Launched the full LMS with school curriculum, skills academy, certificates, and analytics." },
];

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-background min-h-screen">

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[80px] animate-glow-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[70px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-400 mb-6">
            <Sparkles className="w-4 h-4" />
            {t("Our Story", "قصتنا", "Sheekadayada")}
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0.1}
            className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">
            {t("Empowering Somali", "تمكين الطلاب الصوماليين", "Xoojinta Ardayda Soomaalida")}
            <br />
            <span className="shimmer-text">{t("Students Worldwide", "في جميع أنحاء العالم", "Adduunka Oo Dhan")}</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={0.2}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t(
              "We started with a simple belief: every Somali student deserves access to world-class education — regardless of their location or background.",
              "بدأنا بقناعة بسيطة: كل طالب صومالي يستحق التعليم العالمي — بغض النظر عن موقعه أو خلفيته.",
              "Waxaan ku bilaabay aaminsanaan fudud: ardayda Soomalida oo dhan ayaa mudan waxbarashada heerka adduunka — meel kasta oo ay joogaan."
            )}
          </motion.p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 border-y border-border/50 bg-card/20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "25K+", label: t("Active Students",  "طالب نشط",      "Ardayda Firfircoon") },
            { value: "18+",  label: t("Expert Courses",   "دورة متخصصة",   "Koorso Xirfadeed") },
            { value: "95%",  label: t("Completion Rate",  "معدل الإتمام",  "Heerka Dhamaystirka") },
            { value: "4.9★", label: t("Average Rating",   "متوسط التقييم", "Celceliska Qiimaynta") },
          ].map((s, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i * 0.1} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-1">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
              {t("Our Mission", "مهمتنا", "Hadafkayaga")}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6 leading-tight">
              {t("Education Without Borders", "التعليم بلا حدود", "Waxbarasho Xad La'aane ah")}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t(
                "Albayaan.pro is the first AI-powered, fully bilingual (English + Arabic) learning platform built specifically for Somali students. We combine school curriculum with professional skills, gamification, AI tutoring, and cinematic design to make learning addictive and effective.",
                "Albayaan.pro هي أول منصة تعلم مدعومة بالذكاء الاصطناعي وثنائية اللغة مبنية خصيصاً للطلاب الصوماليين.",
                "Albayaan.pro waa madalka waxbarasho ee AI-ga ee ugu horreeya ee lagu dhisay ardayda Soomaalida."
              )}
            </p>
            <div className="space-y-3">
              {[
                t("AI-powered personalized learning paths", "مسارات تعلم شخصية بالذكاء الاصطناعي", "Dariiqdaha waxbarasho ee AI"),
                t("School curriculum + modern skills academy", "منهج مدرسي + أكاديمية مهارات حديثة", "Manhajka dugsiga + akademiyada xirfadaha"),
                t("Verified certificates recognized globally", "شهادات موثقة معترف بها عالمياً", "Shahaadooyin la xaqiijin karo"),
                t("Learn in English, Arabic & Somali", "تعلم بالإنجليزية والعربية والصومالية", "Ku baro Ingiriisi, Carabi & Soomaali"),
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.2}
            className="relative p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {[
                { icon: GraduationCap, label: t("School Curriculum", "منهج مدرسي", "Manhajka Dugsiga"), color: "text-blue-400",   bg: "bg-blue-500/10" },
                { icon: Brain,         label: t("AI Tutoring",        "تدريب AI",   "Tababarka AI"),     color: "text-purple-400", bg: "bg-purple-500/10" },
                { icon: Trophy,        label: t("Certificates",       "شهادات",     "Shahaadooyin"),     color: "text-yellow-400", bg: "bg-yellow-500/10" },
                { icon: Globe,         label: t("3 Languages",        "3 لغات",     "3 Luuqadood"),      color: "text-cyan-400",   bg: "bg-cyan-500/10" },
                { icon: Zap,           label: t("Gamification",       "تلعيب",      "Ciyaargelinta"),    color: "text-orange-400", bg: "bg-orange-500/10" },
                { icon: Users,         label: t("25K+ Students",      "25K+ طالب",  "25K+ Arday"),       color: "text-green-400",  bg: "bg-green-500/10" },
              ].map((item, i) => (
                <div key={i} className={`${item.bg} rounded-2xl p-4 flex flex-col items-center gap-2 text-center`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                  <span className="text-xs font-medium text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 bg-card/20 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center mb-14">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">
              {t("What We Stand For", "ما نؤمن به", "Waxa Aan Ku Taagnahay")}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              {t("Our Core Values", "قيمنا الأساسية", "Qiyamkayaga Aasaasiga")}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i * 0.07}
                className={`p-6 rounded-2xl ${v.bg} border ${v.border}`}>
                <v.icon className={`w-7 h-7 ${v.color} mb-4`} />
                <h3 className="font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-center mb-14">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
            {t("Our Journey", "رحلتنا", "Safarkeena")}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground">
            {t("From Zero to 25K Students", "من الصفر إلى 25 ألف طالب", "Eber ilaa 25K Arday")}
          </h2>
        </motion.div>
        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent" />
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i * 0.1}
                className={`flex items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}>
                <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex flex-col items-center justify-center md:mx-auto relative z-10">
                  <span className="text-xs font-black text-primary">{m.year}</span>
                </div>
                <div className={`flex-1 p-5 rounded-2xl bg-card border border-white/10 ${i % 2 === 1 ? "md:text-right" : ""}`}>
                  <h3 className="font-black text-foreground mb-1">{m.title}</h3>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 bg-card/20 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center mb-14">
            <div className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">
              {t("Expert Instructors", "المدربون الخبراء", "Macallimiinta Khubradi ah")}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              {t("Meet the Team", "تعرّف على الفريق", "La Xiriir Kooxda")}
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {teamMembers.map((member, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i * 0.07}
                className="text-center p-4 rounded-2xl bg-card border border-white/10 hover:border-primary/30 transition-all">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-2xl mx-auto mb-3`}>
                  {member.avatar}
                </div>
                <p className="text-xs font-bold text-foreground leading-tight mb-1">{member.name}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 max-w-4xl mx-auto px-4 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            {t("Ready to Start Learning?", "هل أنت مستعد للتعلم؟", "Ma Diyaar u Tahay Barasho?")}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {t("Join 25,000+ students already learning on Albayaan.pro.", "انضم إلى أكثر من 25,000 طالب يتعلمون على Albayaan.pro.", "Ku biir 25,000+ arday oo horey wax ku baranaya Albayaan.pro.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.35)]">
                <BookOpen className="w-5 h-5" />
                {t("Explore Courses", "استكشف الدورات", "Sahmi Koorsooyinka")}
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
            <Link href="/contact">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-full bg-white/5 border border-white/20 text-foreground font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                {t("Contact Us", "تواصل معنا", "Nala Xiriir")}
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
