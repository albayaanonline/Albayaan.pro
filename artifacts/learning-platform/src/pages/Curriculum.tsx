import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Clock, ArrowRight, Search, Star, Users, GraduationCap,
  Filter, X, Calculator, FlaskConical, Globe, BookMarked,
  Code2, Building2, ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { CURRICULUM_COURSES, SCHOOL_COURSES, UNIVERSITY_COURSES, type Course } from "@/data/courses";

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
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
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
        {course.subSection && (
          <div className={`absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white ${
            course.subSection === "school" ? "bg-blue-600" : "bg-purple-600"
          }`}>
            {course.subSection === "school"
              ? t("School Level", "مستوى مدرسي", "Heerka Dugsiga")
              : t("University Level", "مستوى جامعي", "Heerka Jaamacadda")}
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

type SubFilter = "all" | "school" | "university";

export default function Curriculum() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState<"all" | "english" | "arabic" | "multilingual">("all");
  const [lvlFilter, setLvlFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [subFilter, setSubFilter] = useState<SubFilter>("all");

  const filtered = useMemo(() => {
    return CURRICULUM_COURSES.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q
        || c.title.toLowerCase().includes(q)
        || c.titleAr.includes(q)
        || c.description.toLowerCase().includes(q);
      const matchLang = langFilter === "all" || c.language === langFilter;
      const matchLvl  = lvlFilter === "all" || c.level === lvlFilter;
      const matchSub  = subFilter === "all" || c.subSection === subFilter;
      return matchSearch && matchLang && matchLvl && matchSub;
    });
  }, [search, langFilter, lvlFilter, subFilter]);

  const hasFilters = langFilter !== "all" || lvlFilter !== "all" || !!search || subFilter !== "all";
  const clearFilters = () => {
    setSearch("");
    setLangFilter("all");
    setLvlFilter("all");
    setSubFilter("all");
  };

  const sectionCards = [
    {
      key: "school" as SubFilter,
      icon: Building2,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-500/10 border-blue-500/20",
      label: t("School Level", "المستوى المدرسي", "Heerka Dugsiga"),
      desc: t("Grades 5–12 academic subjects", "مواد أكاديمية للصفوف 5-12", "Mawaadiicta cilmiga 5-12"),
      count: SCHOOL_COURSES.length,
      subjects: [
        { icon: Globe,         label: t("English",    "الإنجليزية", "Ingiriisi") },
        { icon: BookMarked,    label: t("Arabic",     "العربية",    "Carabi") },
        { icon: Calculator,    label: t("Mathematics","الرياضيات",  "Xisaabta") },
        { icon: FlaskConical,  label: t("Science",    "العلوم",     "Sayniska") },
      ],
    },
    {
      key: "university" as SubFilter,
      icon: GraduationCap,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-500/10 border-purple-500/20",
      label: t("University Level", "المستوى الجامعي", "Heerka Jaamacadda"),
      desc: t("Undergraduate & graduate programs", "برامج البكالوريوس والدراسات العليا", "Barnaamijyada jaamacadda"),
      count: UNIVERSITY_COURSES.length,
      subjects: [
        { icon: Code2,         label: t("CS",              "علوم الحاسوب",       "CS") },
        { icon: BookMarked,    label: t("Islamic Studies", "الدراسات الإسلامية", "Cilmiga Islaamiga") },
        { icon: Globe,         label: t("English Adv.",   "الإنجليزية المتقدمة","Ingiriisi Sare") },
        { icon: BookOpen,      label: t("Arabic Adv.",    "العربية المتقدمة",   "Carabi Sare") },
      ],
    },
  ];

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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              {" "}{t("Curriculum", "الأكاديمي", "Cilmiga")}
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t(
              "Structured academic courses for school students and university learners. All levels, AI-assisted, with certificates.",
              "دورات أكاديمية منظمة لطلاب المدارس والجامعات. جميع المستويات بمساعدة الذكاء الاصطناعي مع شهادات.",
              "Koorsooyinka cilmiga nidaamsan ee ardayda dugsiga iyo jaamacadda. Heer walba, AI la caawiso, shahaadooyin."
            )}
          </p>
        </motion.div>

        {/* Sub-section cards */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {sectionCards.map((card, i) => (
            <motion.button
              key={card.key}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubFilter(subFilter === card.key ? "all" : card.key)}
              className={`text-left p-6 rounded-2xl border transition-all duration-200 ${
                subFilter === card.key
                  ? card.bg + " border-opacity-60 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                  : "bg-card border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shrink-0 shadow-md`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-black text-foreground">{card.label}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${card.color}`}>
                      {card.count} {t("courses", "دورات", "koorso")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{card.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {card.subjects.map((s, j) => (
                      <div key={j} className="flex items-center gap-1 text-xs text-muted-foreground">
                        <s.icon className="w-3 h-3" /> {s.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {subFilter === card.key && (
                <div className="mt-3 pt-3 border-t border-white/10 text-xs font-semibold text-primary flex items-center gap-1">
                  <X className="w-3 h-3" /> {t("Click to clear filter", "انقر لمسح الفلتر", "Riix si aad shaandhaynta u nadiifiso")}
                </div>
              )}
            </motion.button>
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
            {(["all", "english", "arabic", "multilingual"] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setLangFilter(lang)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  langFilter === lang
                    ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10"
                }`}
              >
                {lang === "all"
                  ? t("All Languages", "جميع اللغات", "Dhammaan")
                  : lang === "english"
                    ? "🇬🇧 English"
                    : lang === "arabic"
                      ? "🇸🇦 Arabic"
                      : "🌐 Multi"}
              </button>
            ))}
            <div className="w-px h-5 bg-white/20" />
            {(["all", "beginner", "intermediate", "advanced"] as const).map(lvl => {
              const labels: Record<string, string> = {
                all:          t("All Levels", "جميع المستويات", "Dhammaan Heerarka"),
                beginner:     t("Beginner", "مبتدئ", "Bilaabe"),
                intermediate: t("Intermediate", "متوسط", "Dhexe"),
                advanced:     t("Advanced", "متقدم", "Sare"),
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

        {/* Section headers if showing school or university */}
        {(subFilter === "all" && !search && langFilter === "all" && lvlFilter === "all") ? (
          <div className="space-y-12">
            {/* School section */}
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-foreground">{t("School Level Courses", "دورات المستوى المدرسي", "Koorsooyinka Heerka Dugsiga")}</h2>
                  <p className="text-xs text-muted-foreground">{t("Grades 5–12 academic subjects with certificates", "مواد أكاديمية للصفوف 5-12 مع شهادات", "Mawaadiicta cilmiga ardayda dugsiga")}</p>
                </div>
                <button onClick={() => setSubFilter("school")} className="ml-auto flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                  {t("View all", "عرض الكل", "Dhamaan arag")} <ChevronRight className="w-3 h-3" />
                </button>
              </motion.div>
              <AnimatePresence mode="popLayout">
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {SCHOOL_COURSES.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* University section */}
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-foreground">{t("University Level Courses", "دورات المستوى الجامعي", "Koorsooyinka Heerka Jaamacadda")}</h2>
                  <p className="text-xs text-muted-foreground">{t("Undergraduate programs with recognized certificates", "برامج البكالوريوس مع شهادات معترف بها", "Barnaamijyada jaamacadda shahaadooyin la aqoonsan yahay")}</p>
                </div>
                <button onClick={() => setSubFilter("university")} className="ml-auto flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                  {t("View all", "عرض الكل", "Dhamaan arag")} <ChevronRight className="w-3 h-3" />
                </button>
              </motion.div>
              <AnimatePresence mode="popLayout">
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {UNIVERSITY_COURSES.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
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
        )}

      </div>
    </div>
  );
}
