import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, ArrowRight, Search, Star, Users, GraduationCap, Filter, X } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { CURRICULUM_COURSES, type Course } from "@/data/courses";

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

function CourseCard({ course, index }: { course: Course; index: number }) {
  const { t, language } = useLanguage();
  const title = language === "ar" ? course.titleAr : language === "so" ? course.titleSo : course.title;
  const desc  = language === "ar" ? course.descriptionAr : language === "so" ? course.descriptionSo : course.description;
  const lvl   = LEVEL_LABELS[course.level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      className="rounded-2xl bg-card border border-white/10 overflow-hidden hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300 group flex flex-col"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${LEVEL_COLORS[course.level]}`}>
            {lvl ? t(lvl[0], lvl[1], lvl[2]) : course.level}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-white text-xs font-bold">{course.rating}</span>
        </div>
        {course.featured && (
          <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
            ⭐ {t("Featured", "مميز", "Muuqda")}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {course.instructor && (
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 inline-flex items-center justify-center text-white text-[8px] font-bold shrink-0">
              {course.instructor[0]}
            </span>
            {course.instructor}
          </p>
        )}
        <h3 className="font-bold text-lg text-foreground mb-2 leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2 flex-1">{desc}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.lessonCount} {t("lessons", "دروس", "casharro")}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.enrolledCount.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-foreground">${course.price}</span>
            <span className="text-xs text-muted-foreground ml-1">{t("one-time", "دفعة واحدة", "hal mar")}</span>
          </div>
          <Link
            href={`/courses/${course.id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all group-hover:scale-105"
          >
            {t("Enroll", "انضم", "Diiwaan")} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Curriculum() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState<"all" | "english" | "arabic">("all");
  const [lvlFilter, setLvlFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");

  const filtered = useMemo(() => {
    return CURRICULUM_COURSES.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.titleAr.includes(q) || c.description.toLowerCase().includes(q);
      const matchLang = langFilter === "all" || c.language === langFilter;
      const matchLvl  = lvlFilter  === "all" || c.level    === lvlFilter;
      return matchSearch && matchLang && matchLvl;
    });
  }, [search, langFilter, lvlFilter]);

  const hasFilters = langFilter !== "all" || lvlFilter !== "all" || search;
  const clearFilters = () => { setSearch(""); setLangFilter("all"); setLvlFilter("all"); };

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 mb-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-400 mb-4">
            <GraduationCap className="w-4 h-4" />
            {t("Section 1: School & University", "القسم الأول: المدرسة والجامعة", "Qaybta 1: Dugsi & Jaamacad")}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
            {t("Academic", "المنهج", "Manhajka")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500"> {t("Curriculum", "الأكاديمي", "Cilmiga")}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t("Structured academic courses for English and Arabic at every level — Beginner to Advanced. Certified by Al-Bayaan College.", "دورات أكاديمية منظمة للإنجليزية والعربية في كل المستويات — من المبتدئ إلى المتقدم.", "Koorsooyinka cilmiga nidaamsan ee Ingiriisiga iyo Carabiga heer walba — Bilaabista ilaa Sare.")}
          </p>
        </motion.div>

        {/* Curriculum path pills */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { label: t("English Path", "مسار الإنجليزية", "Wadada Ingiriisiga"), sub: t("Beginner → Advanced", "مبتدئ → متقدم", "Bilaabe → Sare"), count: 3, color: "border-blue-500/30 bg-blue-500/10" },
            { label: t("Arabic & Quran Path", "مسار العربية والقرآن", "Wadada Carabiga & Qur'aanka"), sub: t("Beginner → Advanced", "مبتدئ → متقدم", "Bilaabe → Sare"), count: 3, color: "border-green-500/30 bg-green-500/10" },
          ].map((path, i) => (
            <div key={i} className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${path.color}`}>
              <div>
                <div className="font-bold text-foreground text-sm">{path.label}</div>
                <div className="text-xs text-muted-foreground">{path.sub} · {path.count} {t("courses", "دورات", "koorso")}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("Search curriculum...", "البحث في المنهج...", "Raadi manhajka...")}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {(["all", "english", "arabic"] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setLangFilter(lang)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  langFilter === lang
                    ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10"
                }`}
              >
                {lang === "all" ? t("All Languages", "جميع اللغات", "Dhammaan Luuqadaha") : lang === "english" ? "🇬🇧 English" : "🇸🇦 Arabic"}
              </button>
            ))}
            <div className="w-px h-5 bg-white/20" />
            {(["all", "beginner", "intermediate", "advanced"] as const).map(lvl => {
              const labels: Record<string, string> = {
                all: t("All Levels", "جميع المستويات", "Dhammaan Heerarka"),
                beginner: t("Beginner", "مبتدئ", "Bilaabe"),
                intermediate: t("Intermediate", "متوسط", "Dhexe"),
                advanced: t("Advanced", "متقدم", "Sare"),
              };
              return (
                <button
                  key={lvl}
                  onClick={() => setLvlFilter(lvl)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    lvlFilter === lvl
                      ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {labels[lvl]}
                </button>
              );
            })}
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all">
                <X className="w-3 h-3" /> {t("Clear", "مسح", "Nadiifi")}
              </button>
            )}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {filtered.length} {t("courses found", "دورة موجودة", "koorso la helay")}
          </p>
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-foreground mb-2">{t("No courses found", "لم يتم العثور على دورات", "Koorso lama helin")}</h3>
              <button onClick={clearFilters} className="px-5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors mt-4">
                {t("Clear filters", "مسح الفلاتر", "Shaandhaynta nadiifi")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
