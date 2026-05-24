import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, ArrowRight, Search, Star, Users, Filter, X } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { COURSES, type Course } from "@/data/courses";

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
      className="rounded-2xl bg-card border border-white/10 overflow-hidden hover:border-primary/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all duration-300 group flex flex-col"
    >
      {/* Thumbnail */}
      <div className={`relative aspect-video bg-gradient-to-br ${course.color} flex items-center justify-center overflow-hidden`}>
        <span className="text-6xl">{course.thumbnail}</span>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${LEVEL_COLORS[course.level]}`}>
            {lvl ? t(lvl[0], lvl[1], lvl[2]) : course.level}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-white text-xs font-bold">{course.rating}</span>
          <span className="text-white/60 text-xs">({course.ratingCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-foreground mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all group-hover:scale-105"
          >
            {t("Enroll", "انضم", "Diiwaan")} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Courses() {
  const { t } = useLanguage();
  const [search, setSearch]       = useState("");
  const [langFilter, setLangFilter] = useState<"all" | "english" | "arabic">("all");
  const [lvlFilter, setLvlFilter]   = useState<"all" | "beginner" | "intermediate" | "advanced">("all");

  const filtered = useMemo(() => {
    return COURSES.filter(c => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.titleAr.includes(q) ||
        c.description.toLowerCase().includes(q);
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
            <BookOpen className="w-4 h-4" />
            {t("Our Curriculum", "منهجنا الدراسي", "Manhajkeenna")}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
            {t("Available", "الدورات", "Koorsooyinka")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"> {t("Courses", "المتاحة", "La Heli Karo")}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t("6 complete courses — English & Arabic at every level. One-time payment, lifetime access.", "6 دورات كاملة — إنجليزية وعربية في كل المستويات. دفعة واحدة، وصول مدى الحياة.", "6 koorso oo dhamaystiran — Ingiriisi & Carabi heer walba. Hal mar bixi, weligeed gal.")}
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("Search courses...", "البحث في الدورات...", "Raadi koorsooyinka...")}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />

            {/* Language filter */}
            {(["all", "english", "arabic"] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setLangFilter(lang)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  langFilter === lang
                    ? "bg-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/10"
                }`}
              >
                {lang === "all" ? t("All Languages", "جميع اللغات", "Dhammaan Luuqadaha")
                  : lang === "english" ? "🇬🇧 English" : "🇸🇦 Arabic"}
              </button>
            ))}

            <div className="w-px h-5 bg-white/20" />

            {/* Level filter */}
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
                      ? "bg-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/10"
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

          {/* Results count */}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-foreground mb-2">{t("No courses found", "لم يتم العثور على دورات", "Koorso lama helin")}</h3>
              <p className="text-muted-foreground mb-4">{t("Try different filters or search terms", "جرب فلاتر أو مصطلحات بحث مختلفة", "Isku day shaandhaynta ama ereyada raadinta kala duwan")}</p>
              <button onClick={clearFilters} className="px-5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                {t("Clear filters", "مسح الفلاتر", "Shaandhaynta nadiifi")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 text-center">
          <p className="text-muted-foreground text-xs uppercase tracking-widest mb-4">{t("Secure Payment Methods", "طرق الدفع الآمنة", "Habab Lacag Bixin oo Ammaan ah")}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { n: "Zaad", e: "📱" }, { n: "Waafi Pay", e: "💰" }, { n: "VISA", e: "💳" },
              { n: "Mastercard", e: "🔴" }, { n: "PayPal", e: "🅿️" }, { n: "Stripe", e: "⚡" },
            ].map(p => (
              <div key={p.n} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-muted-foreground">
                <span>{p.e}</span> <span className="font-medium">{p.n}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
