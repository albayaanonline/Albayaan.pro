import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGetCourses, useGetUserProgress } from "@/lib/api-client";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  BookOpen, Trophy, CheckCircle, Clock, ArrowRight, Star, Award, Download,
  Flame, Zap, Brain, Medal,
} from "lucide-react";
function generateCertId(userId: string, courseId: string): string {
  let hash = 0;
  const str = ("ALBAYAAN-" + userId + "-" + courseId).toUpperCase();
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
  return "ALBAYAAN-" + hex.slice(0, 4) + "-" + hex.slice(4, 8);
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06 } }),
};

function CircleProgress({ pct, size = 56 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ffffff10" strokeWidth="4" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="url(#dashGrad)" strokeWidth="4"
        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
        strokeLinecap="round" />
      <defs>
        <linearGradient id="dashGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { data: apiCourses } = useGetCourses();
  const { data: progress } = useGetUserProgress();
  const [activeTab, setActiveTab] = useState<"overview" | "progress" | "certificates">("overview");

  const courses = (apiCourses ?? []) as any[];

  const getTitle = (item: any) =>
    language === "ar" ? item?.titleAr : language === "so" ? item?.titleSo : item?.title;

  const enrolledCourses = courses.filter((c: any) =>
    (progress as any[])?.find((p: any) => String(p.courseId) === String(c.id))
  ) ?? [];

  const completedCourses = enrolledCourses.filter((c: any) => {
    const p = (progress as any[])?.find((p: any) => String(p.courseId) === String(c.id));
    return (p?.percentComplete ?? 0) >= 100;
  });

  const inProgressCourses = enrolledCourses.filter((c: any) => {
    const p = (progress as any[])?.find((p: any) => String(p.courseId) === String(c.id));
    const pct = p?.percentComplete ?? 0;
    return pct > 0 && pct < 100;
  });

  const totalLessonsCompleted = (progress as any[])?.reduce(
    (sum: number, p: any) => sum + (p.completedLessons ?? 0), 0
  ) ?? 0;

  const avgProgress = enrolledCourses.length > 0
    ? Math.round((progress as any[])?.reduce((s: number, p: any) => s + (p.percentComplete ?? 0), 0) / enrolledCourses.length)
    : 0;

  const totalXP = completedCourses.length * 500 + totalLessonsCompleted * 25 + inProgressCourses.length * 100;
  const streak = Math.min(enrolledCourses.length * 3 + completedCourses.length, 30);

  const tabs = [
    { id: "overview",      label: t("Overview",      "نظرة عامة",   "Guud-Mar") },
    { id: "progress",      label: t("My Courses",    "دوراتي",      "Koorsooyinkayga") },
    { id: "certificates",  label: t("Certificates",  "شهاداتي",     "Shahaadooyinkayga") },
  ];

  const stats = [
    { icon: BookOpen,    label: t("Enrolled",      "مسجّل",       "Diiwaangashan"),    value: enrolledCourses.length,     color: "text-blue-400",   bg: "bg-blue-500/10",   gradient: "from-blue-500 to-blue-600" },
    { icon: CheckCircle, label: t("Completed",     "مكتمل",       "La Dhamaystiray"), value: completedCourses.length,    color: "text-green-400",  bg: "bg-green-500/10",  gradient: "from-green-500 to-emerald-600" },
    { icon: Flame,       label: t("Day Streak",    "يوم متتالٍ",  "Maalintii"),        value: `${streak}🔥`,              color: "text-orange-400", bg: "bg-orange-500/10", gradient: "from-orange-500 to-red-500" },
    { icon: Zap,         label: t("XP Points",     "نقاط XP",     "Dhibcaha XP"),     value: totalXP,                    color: "text-purple-400", bg: "bg-purple-500/10", gradient: "from-purple-500 to-violet-600" },
  ];

  const badges = [
    { icon: "🚀", label: t("Early Adopter",    "مبتكر مبكر",    "Hortagliyaha"),        earned: enrolledCourses.length > 0 },
    { icon: "📚", label: t("First Lesson",     "أول درس",        "Casharka Hore"),       earned: totalLessonsCompleted > 0 },
    { icon: "🎯", label: t("Course Finisher",  "مكمل الدورة",    "Koorso Dhamaystiray"), earned: completedCourses.length > 0 },
    { icon: "🏆", label: t("Certified",        "معتمد",          "Shahaado haya"),       earned: completedCourses.length >= 1 },
    { icon: "⚡", label: t("Quick Learner",    "متعلم سريع",     "Barasho Degdeg"),      earned: totalLessonsCompleted >= 5 },
    { icon: "🌟", label: t("Multi-Course",     "متعدد الدورات",  "Koorso Badan"),        earned: completedCourses.length >= 2 },
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t("Welcome back,", "مرحباً بعودتك،", "Ku soo dhawow,")}</p>
              <h1 className="text-3xl md:text-4xl font-black text-foreground">
                {user?.name || t("Student", "طالب", "Arday")} 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                {t("Track your progress and manage your learning.", "تتبع تقدمك وأدر تعلمك.", "Raadi horumarkaaga oo waxbarashadaada maamul.")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="relative">
                  <CircleProgress pct={avgProgress} size={72} />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-foreground">
                    {avgProgress}%
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{t("Avg Progress", "متوسط التقدم", "Celceliska")}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.05}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="p-5 rounded-2xl bg-card border border-white/10">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-2xl font-black text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.1}
          className="flex gap-1 p-1 rounded-2xl bg-card border border-white/10 mb-8 w-fit">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}>
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Badges */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.15}
              className="p-6 rounded-2xl bg-card border border-white/10">
              <h2 className="font-black text-foreground mb-4 flex items-center gap-2">
                <Medal className="w-5 h-5 text-yellow-400" />
                {t("Your Badges", "شاراتك", "Astaamahaga")}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {badges.map((b, i) => (
                  <div key={i} className={`text-center p-3 rounded-2xl border transition-all ${
                    b.earned
                      ? "bg-yellow-500/10 border-yellow-500/20"
                      : "bg-white/3 border-white/5 opacity-40 grayscale"
                  }`}>
                    <div className="text-2xl mb-1">{b.icon}</div>
                    <div className="text-[10px] text-muted-foreground leading-tight">{b.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* XP Progress bar */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.2}
              className="p-6 rounded-2xl bg-card border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-black text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  {t("XP & Level", "XP والمستوى", "XP & Heerka")}
                </h2>
                <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold">
                  {t("Level", "المستوى", "Heerka")} {Math.floor(totalXP / 500) + 1}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  {totalXP} XP
                </span>
                <span className="text-sm text-muted-foreground">
                  / {(Math.floor(totalXP / 500) + 1) * 500} XP {t("to next level", "للمستوى التالي", "heerka xiga")}
                </span>
              </div>
              <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(totalXP % 500) / 500 * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-center text-muted-foreground">
                <div className="p-2 rounded-xl bg-white/3">
                  <div className="font-bold text-foreground">{completedCourses.length * 500}</div>
                  <div>{t("from courses", "من الدورات", "koorsooyinka")}</div>
                </div>
                <div className="p-2 rounded-xl bg-white/3">
                  <div className="font-bold text-foreground">{totalLessonsCompleted * 25}</div>
                  <div>{t("from lessons", "من الدروس", "casharra")}</div>
                </div>
                <div className="p-2 rounded-xl bg-white/3">
                  <div className="font-bold text-foreground">{streak * 10}</div>
                  <div>{t("from streak", "من الاستمرارية", "socoshada")}</div>
                </div>
              </div>
            </motion.div>

            {/* Quick actions */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.25}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/courses",           icon: Brain,    color: "from-violet-600 to-blue-600",  label: t("Explore Courses",      "استكشف الدورات",      "Sahmi Koorsooyinka") },
                { href: "/my-certificates",    icon: Award,    color: "from-yellow-500 to-amber-500", label: t("My Certificates",      "شهاداتي",             "Shahaadooyinkayga") },
                { href: "/verify",            icon: Trophy,   color: "from-green-500 to-emerald-500",label: t("Verify Certificate",   "تحقق من شهادة",       "Shahaado Xaqiiji") },
              ].map((a, i) => (
                <Link key={i} href={a.href}>
                  <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                    className={`p-5 rounded-2xl bg-gradient-to-br ${a.color} cursor-pointer flex items-center gap-3 text-white font-bold`}>
                    <a.icon className="w-6 h-6 shrink-0" />
                    <span>{a.label}</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>
        )}

        {/* Tab: My Courses */}
        {activeTab === "progress" && (
          <div className="space-y-4">
            {enrolledCourses.length === 0 ? (
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
                className="text-center py-16 rounded-2xl bg-card border border-white/10">
                <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-black text-foreground mb-2">
                  {t("No courses enrolled yet", "لم تسجل في أي دورة بعد", "Weli koorso lama diiwaangelin")}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t("Browse our courses and start learning today!", "تصفح دوراتنا وابدأ التعلم اليوم!", "Koorsooyinkayaga baadh oo maanta bilow!")}
                </p>
                <Link href="/courses">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm">
                    {t("Browse Courses", "تصفح الدورات", "Koorsooyinka Baadh")}
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
              </motion.div>
            ) : (
              enrolledCourses.map((course: any, i: number) => {
                const p = (progress as any[])?.find((p: any) => String(p.courseId) === String(course.id));
                const pct = p?.percentComplete ?? 0;
                const lessonsCompleted = p?.completedLessons ?? 0;
                const totalLessons = course.lessonCount ?? course.lessons?.length ?? 0;
                const title = getTitle(course) || course.title;

                return (
                  <motion.div key={course.id} initial="hidden" animate="visible"
                    variants={fadeUp} custom={i * 0.05}
                    className="p-5 rounded-2xl bg-card border border-white/10 hover:border-primary/20 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="relative w-14 h-14 shrink-0">
                        <CircleProgress pct={pct} size={56} />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-foreground">
                          {pct}%
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-foreground text-sm leading-tight">{title}</h3>
                          {pct >= 100 && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 text-[10px] font-bold shrink-0">
                              <CheckCircle className="w-3 h-3" /> {t("Done", "مكتمل", "Dhameys")}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> {lessonsCompleted}/{totalLessons} {t("lessons", "دروس", "casharro")}
                          </span>
                          {course.instructor && (
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" /> {course.instructor}
                            </span>
                          )}
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/courses/${course.id}`} className="flex-1">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                              className={`text-center py-2 rounded-xl text-xs font-bold transition-all ${
                                pct >= 100
                                  ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                                  : "bg-primary/15 text-primary hover:bg-primary/25"
                              }`}>
                              {pct >= 100
                                ? t("Revisit Course", "إعادة الدورة", "Dib u Eeg")
                                : pct > 0
                                  ? t("Continue Learning", "متابعة التعلم", "Sii Wad")
                                  : t("Start Now", "ابدأ الآن", "Hadda Bilow")}
                            </motion.div>
                          </Link>
                          {pct >= 100 && (
                            <Link href={`/certificate/${course.id}`}>
                              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="px-3 py-2 rounded-xl bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25 transition-colors text-xs font-bold flex items-center gap-1">
                                <Download className="w-3.5 h-3.5" />
                                {t("Certificate", "الشهادة", "Shahaadada")}
                              </motion.div>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Tab: Certificates */}
        {activeTab === "certificates" && (
          <div>
            {completedCourses.length === 0 ? (
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
                className="text-center py-16 rounded-2xl bg-card border border-white/10">
                <Award className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-black text-foreground mb-2">
                  {t("No certificates yet", "لا توجد شهادات بعد", "Shahaadooyin malaha weli")}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t("Complete a course to earn your first certificate!", "أكمل دورة لتحصل على شهادتك الأولى!", "Koorso dhameyso si aad shahaadada ugu hesho!")}
                </p>
                <Link href="/courses">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm">
                    {t("Start a Course", "ابدأ دورة", "Koorso Bilow")}
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
              </motion.div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {completedCourses.map((course: any, i: number) => {
                    const certId = user
                      ? generateCertId(String(user.id), String(course.id))
                      : "ALBAYAAN-XXXX-XXXX";
                    const title = getTitle(course) || course.title;
                    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

                    return (
                      <motion.div key={course.id} initial="hidden" animate="visible"
                        variants={fadeUp} custom={i * 0.07}
                        className="p-5 rounded-2xl bg-card border border-yellow-500/20 hover:border-yellow-400/40 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shrink-0">
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest mb-1">
                              {t("Certificate of Completion", "شهادة إتمام", "Shahaadada Dhamaystirka")}
                            </div>
                            <h3 className="font-bold text-foreground text-sm mb-1 truncate">{title}</h3>
                            <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {date}
                            </div>
                            <div className="flex gap-2">
                              <Link href={`/certificate/${course.id}`} className="flex-1">
                                <div className="w-full py-2 rounded-xl bg-yellow-500/15 text-yellow-400 text-xs font-bold text-center hover:bg-yellow-500/25 transition-colors flex items-center justify-center gap-1">
                                  <Download className="w-3 h-3" />
                                  {t("Download", "تحميل", "Soo Deg")}
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <Link href="/my-certificates">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-card border border-white/10 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                    {t("View All Certificates →", "عرض جميع الشهادات →", "Dhammaan Shahaadooyinka Arag →")}
                  </motion.div>
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
