import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGetCourses, useGetUserProgress } from "@/lib/api-client";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { BookOpen, Trophy, CheckCircle, Clock, ArrowRight, Star } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { data: courses } = useGetCourses();
  const { data: progress } = useGetUserProgress();

  const getTitle = (item: any) => language === "ar" ? item?.titleAr : language === "so" ? item?.titleSo : item?.title;

  const enrolledCourses = courses?.filter((c: any) => {
    const p = (progress as any[])?.find((p: any) => p.courseId === c.id);
    return p;
  }) ?? [];

  const totalLessonsCompleted = (progress as any[])?.reduce((sum: number, p: any) => sum + (p.completedLessons ?? 0), 0) ?? 0;
  const avgProgress = enrolledCourses.length > 0
    ? Math.round((progress as any[])?.reduce((sum: number, p: any) => sum + (p.percentComplete ?? 0), 0) / enrolledCourses.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-white">
          {t("Welcome back", "مرحباً بعودتك", "Ku soo dhawoow")}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{user?.name}</span>
        </h1>
        <p className="text-muted-foreground mt-2">{t("Continue your learning journey", "واصل رحلتك التعليمية", "Sii wad safarka waxbarashadaada")}</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: BookOpen, label: t("Enrolled Courses", "الدورات المسجلة", "Koorsooyinka la diiwaangeliyay"), value: enrolledCourses.length, color: "text-blue-400", bg: "bg-blue-500/10" },
          { icon: CheckCircle, label: t("Lessons Done", "الدروس المكتملة", "Casharro La Dhamaystiray"), value: totalLessonsCompleted, color: "text-green-400", bg: "bg-green-500/10" },
          { icon: Star, label: t("Avg Progress", "متوسط التقدم", "Horumarka Celceliska"), value: `${avgProgress}%`, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { icon: Trophy, label: t("Certificates", "الشهادات", "Shahaadooyinka"), value: (progress as any[])?.filter((p: any) => p.percentComplete === 100).length ?? 0, color: "text-purple-400", bg: "bg-purple-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl bg-card border border-white/10"
          >
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-5">{t("Your Courses", "دوراتك", "Koorsooyinkaaga")}</h2>
          {enrolledCourses.length > 0 ? (
            <div className="space-y-4">
              {enrolledCourses.map((course: any, i: number) => {
                const p = (progress as any[])?.find((p: any) => p.courseId === course.id);
                const pct = p?.percentComplete ?? 0;
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="p-5 rounded-2xl bg-card border border-white/10 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-white">{getTitle(course)}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{p?.completedLessons ?? 0} / {course.lessonCount} {t("lessons", "دروس", "casharro")}</p>
                      </div>
                      <Link
                        href={`/courses/${course.id}`}
                        className="flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                      >
                        {t("Continue", "متابعة", "Sii wad")} <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    </div>
                    <div className="text-right text-xs text-muted-foreground mt-1">{pct}%</div>
                    {pct === 100 && (
                      <Link href={`/certificate/${course.id}`} className="mt-3 flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                        <Trophy className="w-4 h-4" /> {t("Download Certificate", "تحميل الشهادة", "Soo Degso Shahaadada")}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-card border border-white/10 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{t("You haven't enrolled in any courses yet.", "لم تسجل في أي دورة بعد.", "Weli ma diiwaangelinin koorso.")}</p>
              <Link href="/courses" className="px-6 py-2 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors inline-block">
                {t("Browse Courses", "تصفح الدورات", "Baadh Koorsooyinka")}
              </Link>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-5">{t("Quick Actions", "إجراءات سريعة", "Tallaabooyin Degdeg ah")}</h2>
          <div className="space-y-3">
            {[
              { href: "/courses", label: t("Browse Courses", "تصفح الدورات", "Baadh Koorsooyinka"), icon: BookOpen, color: "text-blue-400" },
              { href: "/access-code", label: t("Redeem Code", "استرداد رمز", "Furo Koodh"), icon: Star, color: "text-yellow-400" },
            ].map((action, i) => (
              <Link key={i} href={action.href} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-white/10 hover:border-primary/30 hover:bg-white/5 transition-all">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <span className="font-medium text-white">{action.label}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
