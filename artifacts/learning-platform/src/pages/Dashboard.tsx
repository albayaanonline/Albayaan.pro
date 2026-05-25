import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGetCourses, useGetUserProgress } from "@/lib/api-client";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { BookOpen, Trophy, CheckCircle, Clock, ArrowRight, Star, Award, Download, ExternalLink } from "lucide-react";

function generateCertId(userId: string, courseId: string): string {
  let hash = 0;
  const str = (userId + courseId + "albayaan").toUpperCase();
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
  return `ALBAYAAN-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${new Date().getFullYear()}`;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06 } }),
};

export default function Dashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { data: courses } = useGetCourses();
  const { data: progress } = useGetUserProgress();

  const getTitle = (item: any) =>
    language === "ar" ? item?.titleAr : language === "so" ? item?.titleSo : item?.title;

  const enrolledCourses = courses?.filter((c: any) =>
    (progress as any[])?.find((p: any) => p.courseId === c.id)
  ) ?? [];

  const completedCourses = enrolledCourses.filter((c: any) => {
    const p = (progress as any[])?.find((p: any) => p.courseId === c.id);
    return (p?.percentComplete ?? 0) >= 100;
  });

  const totalLessonsCompleted = (progress as any[])?.reduce(
    (sum: number, p: any) => sum + (p.completedLessons ?? 0), 0
  ) ?? 0;

  const avgProgress =
    enrolledCourses.length > 0
      ? Math.round(
          (progress as any[])?.reduce((sum: number, p: any) => sum + (p.percentComplete ?? 0), 0) /
            enrolledCourses.length
        )
      : 0;

  const stats = [
    { icon: BookOpen, label: t("Enrolled Courses", "الدورات المسجلة", "Koorsooyinka la diiwaangeliyay"), value: enrolledCourses.length, color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: CheckCircle, label: t("Lessons Done", "الدروس المكتملة", "Casharro La Dhamaystiray"), value: totalLessonsCompleted, color: "text-green-400", bg: "bg-green-500/10" },
    { icon: Star, label: t("Avg Progress", "متوسط التقدم", "Horumarka Celceliska"), value: `${avgProgress}%`, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { icon: Trophy, label: t("Certificates", "الشهادات", "Shahaadooyinka"), value: completedCourses.length, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-black text-foreground">
          {t("Welcome back", "مرحباً بعودتك", "Ku soo dhawoow")},{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {user?.name}
          </span>
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("Continue your learning journey", "واصل رحلتك التعليمية", "Sii wad safarka waxbarashadaada")}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            className="p-5 rounded-2xl bg-card border border-border cursor-default"
          >
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-black text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

        {/* My Courses */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-foreground mb-5">
            {t("Your Courses", "دوراتك", "Koorsooyinkaaga")}
          </h2>
          {enrolledCourses.length > 0 ? (
            <div className="space-y-4">
              {enrolledCourses.map((course: any, i: number) => {
                const p = (progress as any[])?.find((p: any) => p.courseId === course.id);
                const pct = p?.percentComplete ?? 0;
                const isDone = pct >= 100;
                return (
                  <motion.div
                    key={course.id}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={i}
                    whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
                    className={`p-5 rounded-2xl bg-card border transition-colors group ${isDone ? "border-yellow-500/30" : "border-border hover:border-primary/30"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground">{getTitle(course)}</h3>
                          {isDone && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-medium">
                              ✓ Complete
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {p?.completedLessons ?? 0} / {course.lessonCount} {t("lessons", "دروس", "casharro")}
                        </p>
                      </div>
                      <Link
                        href={`/courses/${course.id}`}
                        className="flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                      >
                        {isDone ? t("Review", "مراجعة", "Dib u eeg") : t("Continue", "متابعة", "Sii wad")} <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${isDone ? "bg-gradient-to-r from-yellow-400 to-orange-400" : "bg-gradient-to-r from-blue-500 to-purple-500"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{pct}%</span>
                      {isDone && (
                        <Link
                          href={`/certificate/${course.id}`}
                          className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                        >
                          <Trophy className="w-3.5 h-3.5" />
                          {t("View Certificate", "عرض الشهادة", "Arag Shahaadada")}
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              className="p-10 rounded-2xl bg-card border border-border text-center"
            >
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-5 text-sm">
                {t("You haven't enrolled in any courses yet.", "لم تسجل في أي دورة بعد.", "Weli ma diiwaangelinin koorso.")}
              </p>
              <Link
                href="/courses"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-opacity inline-block"
              >
                {t("Browse Courses", "تصفح الدورات", "Baadh Koorsooyinka")}
              </Link>
            </motion.div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-5">
            {t("Quick Actions", "إجراءات سريعة", "Tallaabooyin Degdeg ah")}
          </h2>
          <div className="space-y-3">
            {[
              { href: "/courses", label: t("Browse Courses", "تصفح الدورات", "Baadh Koorsooyinka"), icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10" },
              { href: "/access-code", label: t("Redeem Code", "استرداد رمز", "Furo Koodh"), icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10" },
              ...(completedCourses.length > 0 ? [{ href: "#certificates", label: t("My Certificates", "شهاداتي", "Shahaadooyinkayga"), icon: Award, color: "text-purple-400", bg: "bg-purple-500/10" }] : []),
            ].map((action, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={action.href}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-white/5 transition-all"
                >
                  <div className={`w-10 h-10 ${action.bg} rounded-lg flex items-center justify-center`}>
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <span className="font-medium text-foreground flex-1">{action.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── My Certificates Section ── */}
      {completedCourses.length > 0 && (
        <motion.div
          id="certificates"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          custom={0}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {t("My Certificates", "شهاداتي", "Shahaadooyinkayga")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("Download and share your achievements", "تنزيل ومشاركة إنجازاتك", "Soo degso oo wadaag guulahaga")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedCourses.map((course: any, i: number) => {
              const certId = user
                ? generateCertId(user.email || String(user.id) || "user", String(course.id))
                : "ALBAYAAN-XXXX-XXXX";
              return (
                <motion.div
                  key={course.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-purple-500/5"
                >
                  {/* Glow */}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(234,179,8,0.06) 0%, transparent 70%)" }} />

                  <div className="relative p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src="/logo-48.png"
                        alt="Albayaan.pro"
                        className="h-10 w-10 object-contain"
                        style={{ filter: "drop-shadow(0 0 8px rgba(59,130,246,0.7))" }}
                      />
                      <div>
                        <div className="text-xs text-yellow-400/70 font-medium tracking-wide uppercase">Certificate</div>
                        <div className="text-xs text-muted-foreground">Al-Bayaan College</div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                    </div>

                    <h3 className="font-bold text-foreground text-sm mb-1 line-clamp-2">
                      {getTitle(course)}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mb-4 truncate">{certId}</p>

                    <div className="flex gap-2">
                      <Link
                        href={`/certificate/${course.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {t("View", "عرض", "Arag")}
                      </Link>
                      <Link
                        href={`/certificate/${course.id}`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
