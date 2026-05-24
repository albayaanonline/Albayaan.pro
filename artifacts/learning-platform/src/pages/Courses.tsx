import { useGetCourses } from "@workspace/api-client-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Clock, ArrowRight, Search } from "lucide-react";

function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card border border-white/10 overflow-hidden animate-pulse">
      <div className="aspect-video bg-white/5" />
      <div className="p-6 space-y-4">
        <div className="h-5 bg-white/10 rounded-lg w-3/4" />
        <div className="space-y-2">
          <div className="h-3.5 bg-white/10 rounded w-full" />
          <div className="h-3.5 bg-white/10 rounded w-2/3" />
        </div>
        <div className="flex justify-between pt-2">
          <div className="h-4 bg-white/10 rounded w-24" />
          <div className="h-4 bg-white/10 rounded w-16" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-7 bg-white/10 rounded w-16" />
          <div className="h-9 bg-white/10 rounded-full w-28" />
        </div>
      </div>
    </div>
  );
}

const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function Courses() {
  const { data: courses, isLoading, isError } = useGetCourses();
  const { t, language } = useLanguage();

  const getTitle = (c: any) => language === "ar" ? c.titleAr : language === "so" ? c.titleSo : c.title;
  const getDesc = (c: any) => language === "ar" ? c.descriptionAr : language === "so" ? c.descriptionSo : c.description;

  return (
    <div className="min-h-screen pt-8 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-400 mb-5">
            <BookOpen className="w-4 h-4" />
            {t("Our Curriculum", "منهجنا الدراسي", "Manhajkaaga Waxbarasho")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {t("Available Courses", "الدورات المتاحة", "Koorsooyinka la heli karo")}
            </span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {t(
              "Choose from our expertly curated language courses and start your journey today.",
              "اختر من دوراتنا اللغوية المنتقاة بعناية وابدأ رحلتك اليوم.",
              "Ka dooro koorsooyinkeena luuqadda ee si hufan loo doortay oo maanta safartaada bilow."
            )}
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <CourseCardSkeleton key={i} />)}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {t("Failed to load courses", "فشل تحميل الدورات", "Koorsooyinka lama soo dejin")}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t("Please check your connection and try again.", "يرجى التحقق من اتصالك والمحاولة مرة أخرى.", "Fadlan hubi xiriirkaaga oo isku day mar kale.")}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
            >
              {t("Try Again", "حاول مرة أخرى", "Isku day mar kale")}
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && (!courses || courses.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {t("No courses yet", "لا توجد دورات بعد", "Wali koorso ma jiraan")}
            </h3>
            <p className="text-muted-foreground">
              {t("New courses are coming soon. Check back later!", "قادمة دورات جديدة قريبًا. تحقق لاحقًا!", "Koorsooyinka cusub ayaa dhawaan imanaya. Horeba u hubi!")}
            </p>
          </motion.div>
        )}

        {/* Courses Grid */}
        {!isLoading && courses && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course: any, i: number) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group relative rounded-2xl bg-card border border-border hover:border-primary/30 overflow-hidden hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-white/5 relative overflow-hidden">
                  {(course as any).thumbnailUrl ? (
                    <img
                      src={(course as any).thumbnailUrl}
                      alt={getTitle(course)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white/20" />
                    </div>
                  )}
                  {/* Level badge */}
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${LEVEL_COLORS[(course as any).level?.toLowerCase()] ?? "bg-white/10 text-white border-white/20"}`}>
                    {(course as any).level}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">{getTitle(course)}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-5 leading-relaxed flex-1">{getDesc(course)}</p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-5">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      {(course as any).lessonCount} {t("Lessons", "دروس", "Cashar")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-purple-400" />
                      {(course as any).duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black text-foreground">${(course as any).price}</div>
                    <Link
                      href={`/courses/${course.id}`}
                      className="group/btn flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all duration-200 text-sm font-semibold"
                    >
                      {t("View Details", "عرض التفاصيل", "Eeg Faahfaahinta")}
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
