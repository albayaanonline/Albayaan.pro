import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Clock, ArrowRight, Search, Star, Users, Filter, X, Globe, Flame, Youtube } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { resolveApiUrl } from "@/lib/adminFetch";
import { YOUTUBE_COURSES, type YouTubeCourse } from "@/data/youtubeCourses";

const LEVEL_COLORS: Record<string, string> = {
  beginner:     "bg-green-500/20 text-green-400 border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  advanced:     "bg-red-500/20 text-red-400 border-red-500/30",
};

const LANG_GRADIENT: Record<string, string> = {
  english:      "from-blue-600 to-cyan-500",
  arabic:       "from-green-600 to-emerald-500",
  multilingual: "from-purple-600 to-pink-500",
};

const LANG_ICON: Record<string, string> = {
  english:      "🇬🇧",
  arabic:       "🇸🇦",
  multilingual: "🌍",
};

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
}

function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card border border-white/10 overflow-hidden animate-pulse">
      <div className="aspect-video bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-white/10 rounded w-3/4" />
        <div className="h-4 bg-white/5 rounded w-full" />
        <div className="h-4 bg-white/5 rounded w-2/3" />
        <div className="h-8 bg-white/10 rounded-xl mt-4" />
      </div>
    </div>
  );
}

function CourseCard({ course, index }: { course: ApiCourse; index: number }) {
  const { t, language } = useLanguage();
  const title = language === "ar" ? course.titleAr : language === "so" ? course.titleSo : course.title;
  const desc  = language === "ar" ? course.descriptionAr : language === "so" ? course.descriptionSo : course.description;
  const gradient = LANG_GRADIENT[course.language] ?? "from-purple-600 to-pink-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      className="rounded-2xl bg-card border border-white/10 overflow-hidden hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all duration-300 group flex flex-col"
    >
      <div className="relative aspect-video overflow-hidden">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = "none";
              const parent = el.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center"><span class="text-6xl">${LANG_ICON[course.language] ?? "📚"}</span></div>`;
              }
            }}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-6xl">{LANG_ICON[course.language] ?? "📚"}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-600/90 text-white capitalize">
            {course.language}
          </span>
          {course.lessonCount > 0 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-600/90 text-white flex items-center gap-1">
              <Flame className="w-3 h-3" /> {t("New", "جديد", "Cusub")}
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-white text-xs font-bold">4.9</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded-full text-xs border ${LEVEL_COLORS[course.level] ?? LEVEL_COLORS.beginner} capitalize`}>
            {course.level}
          </span>
        </div>
        <h3 className="font-bold text-lg text-foreground mb-2 leading-tight group-hover:text-purple-400 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2 flex-1">{desc}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.lessonCount} {t("lessons", "دروس", "casharro")}</span>
          {course.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>}
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {(course.enrolledCount ?? 0).toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-foreground">${course.price}</span>
            <span className="text-xs text-muted-foreground ml-1">{t("one-time", "دفعة واحدة", "hal mar")}</span>
          </div>
          <Link
            href={`/courses/${course.id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all group-hover:scale-105"
          >
            {t("Enroll", "انضم", "Diiwaan")} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function YouTubeCourseCard({ course, index }: { course: YouTubeCourse; index: number }) {
  const { t, language } = useLanguage();
  const title = course.title[language];
  const description = course.description[language];
  const gradient = course.language === "arabic" ? "from-green-600 to-emerald-500" : "from-blue-600 to-cyan-500";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.24) }}
      className="rounded-2xl bg-card border border-white/10 overflow-hidden hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(239,68,68,0.08)] transition-all duration-300 flex flex-col"
    >
      <div className={`relative aspect-[16/8] bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 bg-black/15" />
        <Youtube className="relative w-14 h-14 text-white drop-shadow-lg" aria-hidden="true" />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/45 border border-white/15 text-xs font-bold text-white">
          {t("YouTube playlist", "قائمة يوتيوب", "Liis YouTube")}
        </span>
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/45 border border-white/15 text-xs font-bold text-white">
          {t("Free", "مجانية", "Bilaash")}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 border border-green-500/20 text-green-300">
            {t("Beginner", "مبتدئ", "Bilaabe")}
          </span>
          <span className="text-xs text-muted-foreground">
            {course.language === "arabic"
              ? t("Arabic", "العربية", "Carabi")
              : t("English", "الإنجليزية", "Ingiriisi")}
          </span>
        </div>
        <h3 className="font-bold text-lg text-foreground mb-2 leading-tight line-clamp-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {description}
        </p>
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5 min-w-0">
            <Youtube className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="truncate">{course.sourceChannel}</span>
          </span>
          {course.lessonCount && (
            <span className="flex items-center gap-1 shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
              {course.lessonCount}
            </span>
          )}
        </div>
        <Link
          href={`/courses/youtube/${course.slug}`}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600/90 hover:bg-red-500 text-white text-sm font-bold transition-colors"
        >
          {t("Watch course", "شاهد الدورة", "Daawo koorsada")}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  );
}

export default function Courses() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState<"all" | "english" | "arabic" | "multilingual">("all");
  const [lvlFilter, setLvlFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");

  const { data: courses = [], isLoading } = useQuery<ApiCourse[]>({
    queryKey: ["/api/courses"],
    queryFn: async () => {
      const res = await fetch(resolveApiUrl("/api/courses"));
      if (!res.ok) throw new Error("Failed to load courses");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const filtered = useMemo(() => {
    return courses.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      const matchLang = langFilter === "all" || c.language === langFilter;
      const matchLvl  = lvlFilter === "all" || c.level === lvlFilter;
      return matchSearch && matchLang && matchLvl;
    });
  }, [courses, search, langFilter, lvlFilter]);

  const filteredYouTubeCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return YOUTUBE_COURSES.filter(course => {
      const searchableText = [
        course.title.en,
        course.title.ar,
        course.title.so,
        course.description.en,
        course.description.ar,
        course.description.so,
        course.sourceTitle,
        course.sourceChannel,
      ].join(" ").toLowerCase();
      const matchSearch = !query || searchableText.includes(query);
      const matchLanguage = langFilter === "all" || course.language === langFilter;
      const matchLevel = lvlFilter === "all" || course.level === lvlFilter;
      return matchSearch && matchLanguage && matchLevel;
    });
  }, [search, langFilter, lvlFilter]);

  const hasFilters = langFilter !== "all" || lvlFilter !== "all" || search;
  const clearFilters = () => { setSearch(""); setLangFilter("all"); setLvlFilter("all"); };
  const resultCount = filtered.length + filteredYouTubeCourses.length;

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 mb-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-medium text-purple-400 mb-4">
            <Globe className="w-4 h-4" />
            {t("Al-Bayaan College — Language Courses", "دورات اللغة — كلية البيان", "Koorsooyinka Luqadda — Kulliyada Al-Bayaan")}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
            {t("Learn a", "تعلم", "Baro")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"> {t("New Language", "لغة جديدة", "Luqad Cusub")}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t(
              "English and Arabic language courses designed for Somali learners. Start your journey today.",
              "دورات اللغة الإنجليزية والعربية مصممة للمتعلمين الصوماليين. ابدأ رحلتك اليوم.",
              "Koorsooyinka luqadda Ingiriisiga iyo Carabiga ee loogu talagalay ardayda Soomaalida. Bilow safarkaaga maanta."
            )}
          </p>
        </motion.div>

        {/* Language filter pills */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 flex-nowrap justify-center">
            {(["all", "english", "arabic", "multilingual"] as const).map(lang => {
              const labels = {
                all:          t("All Courses", "جميع الدورات", "Dhammaan Koorsooyinka"),
                english:      t("English", "الإنجليزية", "Ingiriis"),
                arabic:       t("Arabic", "العربية", "Carabiga"),
                multilingual: t("Multilingual", "متعدد اللغات", "Luqado Badan"),
              };
              const count = lang === "all"
                ? courses.length + YOUTUBE_COURSES.length
                : courses.filter(c => c.language === lang).length + YOUTUBE_COURSES.filter(c => c.language === lang).length;
              return (
                <button key={lang} onClick={() => setLangFilter(lang)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    langFilter === lang
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {lang !== "all" && <span>{LANG_ICON[lang]}</span>}
                  {labels[lang]}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${langFilter === lang ? "bg-white/20" : "bg-white/10"}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Search & Level Filters */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8 space-y-3">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("Search courses...", "البحث في الدورات...", "Raadi koorsooyinka...")}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500/40 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 flex-nowrap justify-start sm:justify-center">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            {(["all", "beginner", "intermediate", "advanced"] as const).map(lvl => {
              const labels: Record<string, string> = {
                all:          t("All Levels", "جميع المستويات", "Dhammaan Heerarka"),
                beginner:     t("Beginner",   "مبتدئ",           "Bilaabe"),
                intermediate: t("Intermediate","متوسط",           "Dhexe"),
                advanced:     t("Advanced",   "متقدم",           "Sare"),
              };
              return (
                <button key={lvl} onClick={() => setLvlFilter(lvl)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    lvlFilter === lvl
                      ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {labels[lvl]}
                </button>
              );
            })}
            {hasFilters && (
              <button onClick={clearFilters} className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all">
                <X className="w-3 h-3" /> {t("Clear", "مسح", "Nadiifi")}
              </button>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {isLoading ? t("Loading…", "جاري التحميل…", "Waa la soo rarayo…") : `${resultCount} ${t("courses found", "دورة موجودة", "koorso la helay")}`}
          </p>
        </motion.div>

        {filteredYouTubeCourses.length > 0 && (
          <section className="mb-14" aria-labelledby="youtube-courses-heading">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-red-300 text-sm font-semibold mb-2">
                  <Youtube className="w-4 h-4" />
                  {t("Learn from real YouTube lessons", "تعلم من دروس يوتيوب حقيقية", "Ka baro casharro YouTube oo dhab ah")}
                </div>
                <h2 id="youtube-courses-heading" className="text-2xl md:text-3xl font-black text-foreground">
                  {t("Free YouTube Courses", "دورات يوتيوب مجانية", "Koorsooyin YouTube oo Bilaash ah")}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-lg">
                {t(
                  "Complete public playlists from their original creators, played directly through YouTube.",
                  "قوائم تشغيل عامة كاملة من منشئيها الأصليين، تُعرض مباشرة عبر يوتيوب.",
                  "Liisaska casharrada dadweynaha ee abuureyaashooda, si toos ahna YouTube looga daawanayo."
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredYouTubeCourses.map((course, index) => (
                <YouTubeCourseCard key={course.slug} course={course} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <CourseCardSkeleton key={i} />)}
            </motion.div>
          ) : filtered.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} />
              ))}
            </motion.div>
          ) : filteredYouTubeCourses.length > 0 ? null : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-foreground mb-2">{t("No courses found", "لم يتم العثور على دورات", "Koorso lama helin")}</h3>
              {hasFilters ? (
                <>
                  <p className="text-muted-foreground mb-4">{t("Try different filters", "جرب فلاتر مختلفة", "Isku day shaandhaynta kala duwan")}</p>
                  <button onClick={clearFilters} className="px-5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                    {t("Clear filters", "مسح الفلاتر", "Shaandhaynta nadiifi")}
                  </button>
                </>
              ) : (
                <p className="text-muted-foreground">{t("New courses are coming soon!", "الدورات الجديدة قادمة قريباً!", "Koorsooyinka cusub ayaa soo socda!")}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 text-center">
          <p className="text-muted-foreground text-xs uppercase tracking-widest mb-4">{t("Secure Payment Methods", "طرق الدفع الآمنة", "Habab Lacag Bixin oo Ammaan ah")}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[{ n: "EVC Plus", e: "📱" }, { n: "Somtel", e: "💰" }, { n: "E-Pir", e: "💳" }, { n: "WhatsApp Pay", e: "💬" }].map(p => (
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
