import { useGetCourse } from "@workspace/api-client-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { PlayCircle, Lock, CheckCircle, BookOpen, Clock, ArrowLeft, Trophy, Users, Star } from "lucide-react";

function CourseDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <div className="h-10 bg-white/10 rounded-xl w-3/4" />
            <div className="h-5 bg-white/10 rounded-lg w-full" />
            <div className="h-5 bg-white/10 rounded-lg w-2/3" />
          </div>
          <div className="space-y-3 pt-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 bg-white/5 rounded-xl border border-white/10" />
            ))}
          </div>
        </div>
        <div>
          <div className="rounded-2xl bg-card border border-white/10 p-6 space-y-4">
            <div className="h-10 bg-white/10 rounded-xl w-24" />
            <div className="h-12 bg-white/10 rounded-xl" />
            <div className="h-10 bg-white/10 rounded-xl" />
            <div className="space-y-2 pt-4">
              {[1,2,3].map(i => <div key={i} className="h-5 bg-white/10 rounded-lg" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CourseDetail() {
  const { courseId } = useParams();
  const { data: course, isLoading, isError } = useGetCourse(Number(courseId), {
    query: { enabled: !!courseId }
  });
  const { t, language } = useLanguage();

  if (isLoading) return <CourseDetailSkeleton />;

  if (isError || !course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          {t("Course not found", "الدورة غير موجودة", "Koorsaha lama helin")}
        </h2>
        <Link href="/courses" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t("Back to Courses", "العودة إلى الدورات", "Ku Noqo Koorsooyinka")}
        </Link>
      </div>
    );
  }

  const getTitle = (item: any) => language === "ar" ? item.titleAr : language === "so" ? item.titleSo : item.title;
  const getDesc = (item: any) => language === "ar" ? item.descriptionAr : language === "so" ? item.descriptionSo : item.description;

  const freeLessons = (course as any).lessons?.filter((l: any) => !l.isLocked).length ?? 0;

  return (
    <div className="min-h-screen pb-16">
      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t("All Courses", "جميع الدورات", "Dhammaan Koorsooyinka")}
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  {(course as any).level}
                </span>
                {freeLessons > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                    {freeLessons} {t("Free Lessons", "دروس مجانية", "Cashar Bilaash ah")}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-5 leading-tight">
                {getTitle(course)}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {getDesc(course)}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-border">
                {[
                  { icon: BookOpen, label: `${(course as any).lessonCount} ${t("Lessons", "دروس", "Cashar")}`, color: "text-blue-400" },
                  { icon: Clock, label: (course as any).duration, color: "text-purple-400" },
                  { icon: Trophy, label: t("Certificate", "شهادة", "Shahaadad"), color: "text-yellow-400" },
                  { icon: Users, label: t("Lifetime Access", "وصول مدى الحياة", "Galitaan weligeed"), color: "text-green-400" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    {stat.label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Lessons List */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-5">
                {t("Course Curriculum", "منهج الدورة", "Manhajka Koorsada")}
              </h3>
              <div className="space-y-3">
                {(course as any).lessons?.map((lesson: any, i: number) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${lesson.isLocked ? "bg-white/5" : "bg-primary/10"}`}>
                        {lesson.isLocked
                          ? <Lock className="w-4 h-4 text-muted-foreground" />
                          : <PlayCircle className="w-4 h-4 text-primary" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{getTitle(lesson)}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{lesson.duration}</p>
                      </div>
                    </div>
                    {!lesson.isLocked ? (
                      <Link
                        href={`/learn/${(course as any).id}/${lesson.id}`}
                        className="flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        {t("Start", "ابدأ", "Bilow")}
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {t("Locked", "مقفل", "Xidhan")}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="sticky top-24 rounded-2xl bg-card border border-border shadow-[0_0_40px_rgba(0,0,0,0.2)] overflow-hidden"
            >
              {/* Price Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-black text-foreground">${(course as any).price}</span>
                  <span className="text-muted-foreground text-sm">{t("one-time", "مرة واحدة", "hal mar")}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 mt-1">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                  <span className="text-xs text-muted-foreground ml-1">5.0</span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <Link
                  href={`/payment/${(course as any).id}`}
                  className="block w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all"
                >
                  {t("Enroll Now", "سجل الآن", "Hadda Is Diiwaangeli")}
                </Link>
                <Link
                  href="/access-code"
                  className="block w-full text-center py-3.5 rounded-xl bg-card border border-border text-foreground font-medium hover:bg-white/5 transition-colors text-sm"
                >
                  {t("I have an access code", "لدي رمز دخول", "Waxaan hayaa koodh")}
                </Link>
              </div>

              <div className="px-6 pb-6 space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                  {t("This course includes:", "تشمل هذه الدورة:", "Koorsadani waxay ku jirtaa:")}
                </p>
                {[
                  { icon: BookOpen, label: `${(course as any).lessonCount} ${t("lessons", "دروس", "casharro")}` },
                  { icon: Clock, label: `${(course as any).duration} ${t("of content", "من المحتوى", "oo nuxur ah")}` },
                  { icon: Trophy, label: t("Certificate of completion", "شهادة إتمام", "Shahaadada dhamaystirka") },
                  { icon: Users, label: t("Lifetime access", "وصول مدى الحياة", "Galitaan weligeed") },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                    {item.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
