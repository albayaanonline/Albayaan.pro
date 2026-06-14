import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { PlayCircle, Lock, CheckCircle, BookOpen, Clock, ArrowLeft, Trophy, Users, Star, Zap, Shield, Loader2 } from "lucide-react";
import { resolveApiUrl } from "@/lib/adminFetch";

const LEVEL_COLORS: Record<string, string> = {
  beginner:     "bg-green-500/20 text-green-400 border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  advanced:     "bg-red-500/20 text-red-400 border-red-500/30",
};

const LEVEL_LABELS: Record<string, [string, string, string]> = {
  beginner:     ["Beginner",     "مبتدئ",    "Bilaabe"],
  intermediate: ["Intermediate", "متوسط",    "Dhexe"],
  advanced:     ["Advanced",     "متقدم",    "Sare"],
};

const LANG_GRADIENT: Record<string, string> = {
  english:      "from-blue-600 to-cyan-500",
  arabic:       "from-green-600 to-emerald-500",
  multilingual: "from-purple-600 to-pink-500",
};

interface ApiLesson {
  id: number;
  courseId: number;
  title: string;
  titleAr: string;
  titleSo: string;
  order: number;
  duration: string;
  isLocked: boolean;
  hasQuiz: boolean;
}

interface ApiCourse {
  id: number;
  slug: string;
  title: string;
  titleAr: string;
  titleSo: string;
  description: string;
  descriptionAr: string;
  descriptionSo: string;
  language: string;
  level: string;
  price: number;
  lessonCount: number;
  duration: string;
  thumbnailUrl: string | null;
  enrolledCount: number;
  isPublished: boolean;
  lessons: ApiLesson[];
}

export default function CourseDetail() {
  const { courseId } = useParams();
  const { t, language } = useLanguage();

  const { data: course, isLoading, error } = useQuery<ApiCourse>({
    queryKey: ["/api/courses", courseId],
    queryFn: async () => {
      const res = await fetch(resolveApiUrl(`/api/courses/${courseId}`));
      if (!res.ok) throw new Error("Course not found");
      return res.json();
    },
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-3xl">😕</div>
        <h2 className="text-xl font-bold text-foreground">{t("Course not found", "الدورة غير موجودة", "Koorsaha lama helin")}</h2>
        <Link href="/courses" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t("Back to Courses", "العودة إلى الدورات", "Ku Noqo Koorsooyinka")}
        </Link>
      </div>
    );
  }

  const title       = language === "ar" ? course.titleAr       : language === "so" ? course.titleSo       : course.title;
  const description = language === "ar" ? course.descriptionAr : language === "so" ? course.descriptionSo : course.description;
  const lvlLabels   = LEVEL_LABELS[course.level];
  const levelLabel  = lvlLabels ? t(lvlLabels[0], lvlLabels[1], lvlLabels[2]) : course.level;
  const gradient    = LANG_GRADIENT[course.language] ?? "from-purple-600 to-pink-500";

  const freeCount   = (course.lessons ?? []).filter(l => !l.isLocked).length;
  const lockedCount = (course.lessons ?? []).filter(l => l.isLocked).length;

  const includes = [
    { icon: BookOpen, text: t(`${course.lessonCount} structured lessons`, `${course.lessonCount} درساً منظماً`, `${course.lessonCount} casharro nidaamsan`) },
    { icon: Clock,    text: course.duration },
    { icon: Zap,      text: t("AI-powered learning assistant", "مساعد التعلم الذكي", "Kaaliyaha barasho AI ah") },
    { icon: Trophy,   text: t("Completion certificate", "شهادة الإتمام", "Shahaadada dhameysirka") },
    { icon: Shield,   text: t("Lifetime access", "وصول مدى الحياة", "Galitaan weligeed ah") },
    { icon: Users,    text: t(`${(course.enrolledCount ?? 0).toLocaleString()} students enrolled`, `${(course.enrolledCount ?? 0).toLocaleString()} طالب مسجل`, `${(course.enrolledCount ?? 0).toLocaleString()} arday diiwaan galiyay`) },
  ];

  return (
    <div className="min-h-screen pt-8 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <Link href="/courses" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          {t("All Courses", "جميع الدورات", "Dhammaan Koorsooyinka")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 relative">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = "none";
                    }}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <span className="text-8xl">{course.language === "arabic" ? "🇸🇦" : "🇬🇧"}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-bold border ${LEVEL_COLORS[course.level]}`}>
                    {levelLabel}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-bold text-sm">4.9</span>
                  <span className="text-white/60 text-xs">(120 {t("reviews", "مراجعات", "dib-u-eegis")})</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4 leading-tight">{title}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">{description}</p>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-2 sm:gap-4">
              {[
                { label: t("Lessons",  "دروس",  "Casharro"),  value: course.lessonCount },
                { label: t("Duration", "المدة", "Muddada"),   value: course.duration },
                { label: t("Students", "طلاب",  "Ardayda"),   value: (course.enrolledCount ?? 0).toLocaleString() + "+" },
              ].map((s, i) => (
                <div key={i} className="p-3 sm:p-4 rounded-xl bg-card border border-white/10 text-center">
                  <div className="text-base sm:text-2xl font-black text-foreground break-words">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Curriculum */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="text-xl sm:text-2xl font-black text-foreground">{t("Curriculum", "المنهج الدراسي", "Manhajka")}</h2>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  <span className="text-green-400 font-medium">{freeCount} {t("free", "مجاني", "bilaash")}</span>
                  {" • "}
                  <span className="text-muted-foreground">{lockedCount} {t("premium", "مميز", "premium")}</span>
                </div>
              </div>

              {(course.lessons ?? []).length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-white/10 bg-card">
                  <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="text-muted-foreground">{t("Lessons coming soon!", "الدروس قادمة قريباً!", "Casharro ayaa soo socda!")}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(course.lessons ?? []).map((lesson, i) => {
                    const lessonTitle = language === "ar" ? lesson.titleAr : language === "so" ? lesson.titleSo : lesson.title;
                    return (
                      <div key={lesson.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                          lesson.isLocked
                            ? "bg-card border-white/5 opacity-70"
                            : "bg-card border-white/10 hover:border-primary/30 hover:bg-primary/5"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          lesson.isLocked ? "bg-white/5" : "bg-primary/10"
                        }`}>
                          {lesson.isLocked
                            ? <Lock className="w-4 h-4 text-muted-foreground" />
                            : <PlayCircle className="w-4 h-4 text-primary" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-mono">{String(i + 1).padStart(2, "0")}</span>
                            <span className={`font-medium text-sm truncate ${lesson.isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                              {lessonTitle}
                            </span>
                            {lesson.hasQuiz && (
                              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs border border-purple-500/30">
                                Quiz
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                          {lesson.isLocked ? (
                            <span className="px-2 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
                              {t("Premium", "مميز", "Premium")}
                            </span>
                          ) : (
                            <Link
                              href={`/learn/${course.id}/${lesson.id}`}
                              className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-colors flex items-center gap-1"
                            >
                              <PlayCircle className="w-3 h-3" />
                              {t("Start", "ابدأ", "Bilow")}
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right column — enrollment card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 p-6 rounded-2xl bg-card border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)]"
            >
              <div className="text-center mb-6">
                <div className="text-4xl font-black text-foreground">${course.price}</div>
                <div className="text-muted-foreground text-sm">{t("one-time payment", "دفعة واحدة", "hal mar bixi")}</div>
              </div>

              <Link
                href={`/payment/${course.id}`}
                className={`w-full py-4 rounded-xl bg-gradient-to-r ${gradient} text-white font-black text-lg flex items-center justify-center gap-2 hover:opacity-90 hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all mb-4`}
              >
                {t("Enroll Now", "انضم الآن", "Hadda Diiwaan")}
              </Link>

              <Link
                href="/access-code"
                className="w-full py-3 rounded-xl border border-white/10 text-muted-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/5 transition-colors mb-6"
              >
                {t("Have an access code?", "لديك رمز الوصول؟", "Ma lihid koodhka galitaanka?")}
              </Link>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground text-sm">{t("This course includes:", "تشمل هذه الدورة:", "Koorsooyinkan waxaa ku jira:")}</h4>
                {includes.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <item.icon className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                  <Shield className="w-3.5 h-3.5 text-green-400" />
                  {t("30-day money-back guarantee", "ضمان استرداد 30 يوماً", "30 maalmood lacag-celin damaano")}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-muted-foreground text-center mb-3">{t("We accept:", "نقبل:", "Waxaan aqbalnaa:")}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[{ n: "EVC Plus", e: "📱" }, { n: "Somtel", e: "💰" }, { n: "E-Pir", e: "💳" }].map(p => (
                    <div key={p.n} className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-muted-foreground">
                      <span>{p.e}</span> <span>{p.n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
