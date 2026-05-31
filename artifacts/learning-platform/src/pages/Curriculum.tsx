import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Clock, ArrowRight, Search, Star, Users, GraduationCap,
  X, Calculator, FlaskConical, Globe, BookMarked, Code2, Building2,
  ChevronRight, Atom, Lightbulb, Map, Scroll, Languages, Music,
  Trophy, Award, Sparkles, Brain,
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { CURRICULUM_COURSES, SCHOOL_COURSES, UNIVERSITY_COURSES, type Course } from "@/data/courses";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.05 } }),
};

const LEVEL_COLORS: Record<string, string> = {
  beginner:     "bg-green-500/20 text-green-400 border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  advanced:     "bg-red-500/20 text-red-400 border-red-500/30",
};
const LEVEL_LABELS: Record<string, [string, string, string]> = {
  beginner:     ["Beginner",     "مبتدئ",  "Bilaabe"],
  intermediate: ["Intermediate", "متوسط",  "Dhexe"],
  advanced:     ["Advanced",     "متقدم",  "Sare"],
};

const PRIMARY_ICONS: Record<string, React.FC<any>> = {
  mathematics:     Calculator,
  science:         FlaskConical,
  english:         Globe,
  arabic:          BookMarked,
  somali:          Languages,
  "islamic studies": Music,
  default:         BookOpen,
};

const CATEGORY_ICONS: Record<string, React.FC<any>> = {
  Mathematics:        Calculator,
  Science:            FlaskConical,
  English:            Globe,
  Arabic:             BookMarked,
  Somali:             Languages,
  Physics:            Atom,
  Chemistry:          Lightbulb,
  Biology:            FlaskConical,
  Geography:          Map,
  History:            Scroll,
  "Islamic Studies":  Music,
  "Computer Science": Code2,
  default:            BookOpen,
};

function getIcon(course: Course) {
  const Icon = CATEGORY_ICONS[course.category] || CATEGORY_ICONS.default;
  return Icon;
}

function CourseCard({ course, index }: { course: Course; index: number }) {
  const { t, language } = useLanguage();
  const title = language === "ar" ? course.titleAr : language === "so" ? course.titleSo : course.title;
  const desc  = language === "ar" ? course.descriptionAr : language === "so" ? course.descriptionSo : course.description;
  const lvl   = LEVEL_LABELS[course.level];
  const Icon  = getIcon(course);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index * 0.04, 0.25) }}
      className="rounded-2xl bg-card border border-white/10 overflow-hidden hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300 group flex flex-col"
    >
      <div className="relative aspect-video overflow-hidden bg-card">
        <img src={course.imageUrl} alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${course.color} flex items-center justify-center text-2xl shadow-2xl`}>
            {course.thumbnail}
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${LEVEL_COLORS[course.level]}`}>
            {lvl ? t(lvl[0], lvl[1], lvl[2]) : course.level}
          </span>
        </div>
        {/* Top-right: rating */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded-full">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-white text-xs font-bold">{course.rating}</span>
        </div>
        {/* Bottom-left: section label */}
        {course.subSection && (
          <div className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
            course.subSection === "school" ? "bg-blue-600" :
            course.subSection === "primary" ? "bg-green-600" :
            course.subSection === "secondary" ? "bg-blue-600" :
            "bg-purple-600"
          }`}>
            {course.subSection === "school"     ? t("School",     "مدرسي",  "Dugsi") :
             course.subSection === "primary"    ? t("Primary",    "ابتدائي","Hoose") :
             course.subSection === "secondary"  ? t("Secondary",  "ثانوي",  "Sare")  :
             course.subSection === "university" ? t("University", "جامعي",  "Jaamacad") : ""}
          </div>
        )}
        {/* Bottom-right: NEW badge — avoids overlap with top-left level badge */}
        {course.isNew && (
          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/90 text-white">NEW</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start gap-2 mb-2">
          <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-primary font-semibold">{course.category}</p>
        </div>
        <h3 className="font-black text-foreground text-sm leading-tight mb-2 line-clamp-2">{title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1 mb-4">{desc}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.lessonCount} {t("lessons","دروس","casharro")}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{(course.enrolledCount || 0).toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              ${course.price}
            </span>
            {course.certificate && (
              <span className="flex items-center gap-0.5 text-[10px] text-yellow-400 font-semibold">
                <Award className="w-3 h-3" />{t("Certificate","شهادة","Shahaado")}
              </span>
            )}
          </div>
          <Link href={`/courses/${course.id}`}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold shadow-lg hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-shadow">
              {t("Enroll","التسجيل","Diiwaangeli")} <ArrowRight className="w-3 h-3" />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

const TABS = [
  { key: "all",        en: "All Levels",  ar: "جميع المستويات", so: "Dhammaan Heerarka" },
  { key: "primary",    en: "Primary",     ar: "المرحلة الابتدائية", so: "Dugsiga Hoose" },
  { key: "secondary",  en: "Secondary",   ar: "المرحلة الثانوية",   so: "Dugsiga Sare" },
  { key: "university", en: "University",  ar: "الجامعة",            so: "Jaamacadda" },
];

const PRIMARY_SUBJECTS = [
  { icon: Calculator, label: "Mathematics",    color: "from-blue-500 to-cyan-400",    bg: "bg-blue-500/10" },
  { icon: FlaskConical,label:"Science",        color: "from-green-500 to-emerald-400",bg: "bg-green-500/10" },
  { icon: Globe,      label: "English",        color: "from-indigo-500 to-blue-400",  bg: "bg-indigo-500/10" },
  { icon: BookMarked, label: "Arabic",         color: "from-amber-500 to-yellow-400", bg: "bg-amber-500/10" },
  { icon: Languages,  label: "Somali",         color: "from-sky-500 to-cyan-400",     bg: "bg-sky-500/10" },
  { icon: Music,      label: "Islamic Studies",color: "from-yellow-500 to-amber-400", bg: "bg-yellow-500/10" },
];

const SECONDARY_SUBJECTS = [
  { icon: Atom,       label: "Physics",        color: "from-purple-500 to-violet-400",bg: "bg-purple-500/10" },
  { icon: Lightbulb,  label: "Chemistry",      color: "from-orange-500 to-red-400",   bg: "bg-orange-500/10" },
  { icon: FlaskConical,label:"Biology",        color: "from-teal-500 to-green-400",   bg: "bg-teal-500/10" },
  { icon: Calculator, label: "Mathematics",    color: "from-blue-500 to-cyan-400",    bg: "bg-blue-500/10" },
  { icon: Map,        label: "Geography",      color: "from-cyan-500 to-blue-400",    bg: "bg-cyan-500/10" },
  { icon: Scroll,     label: "History",        color: "from-rose-500 to-pink-400",    bg: "bg-rose-500/10" },
  { icon: Globe,      label: "English",        color: "from-indigo-500 to-blue-400",  bg: "bg-indigo-500/10" },
  { icon: BookMarked, label: "Arabic",         color: "from-amber-500 to-yellow-400", bg: "bg-amber-500/10" },
  { icon: Code2,      label: "Computer Sci.",  color: "from-violet-500 to-purple-400",bg: "bg-violet-500/10" },
];

const UNIVERSITY_SUBJECTS = [
  { icon: Code2,      label: "Computer Science",  color: "from-violet-500 to-purple-400",bg: "bg-violet-500/10" },
  { icon: Music,      label: "Islamic Studies",   color: "from-yellow-500 to-amber-400", bg: "bg-yellow-500/10" },
  { icon: Building2,  label: "Business",          color: "from-orange-500 to-amber-400", bg: "bg-orange-500/10" },
  { icon: Brain,      label: "AI & Technology",   color: "from-blue-500 to-indigo-400",  bg: "bg-blue-500/10" },
];

export default function CurriculumPage() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredCourses = useMemo(() => {
    let courses = CURRICULUM_COURSES;
    if (activeTab === "primary")    courses = courses.filter(c => c.subSection === "primary" || (c.subSection === "school" && !c.category.match(/^(Physics|Chemistry|Biology|Geography|History)$/)));
    if (activeTab === "secondary")  courses = courses.filter(c => c.subSection === "secondary" || c.subSection === "school");
    if (activeTab === "university") courses = courses.filter(c => c.subSection === "university");

    if (search.trim()) {
      const q = search.toLowerCase();
      courses = courses.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.titleAr || "").includes(q) ||
        (c.titleSo || "").toLowerCase().includes(q)
      );
    }
    return courses;
  }, [activeTab, search]);

  return (
    <div className="w-full bg-background min-h-screen">

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-[70px] sm:blur-[100px] animate-glow-pulse" />
          <div className="hidden sm:block absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/8 rounded-full blur-[80px] animate-glow-pulse" style={{ animationDelay: "2s" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-400 mb-5">
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span className="text-center leading-tight">{t("School & University Curriculum", "المنهج المدرسي والجامعي", "Manhajka Dugsiga & Jaamacadda")}</span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0.05}
            className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground mb-4 leading-tight">
            {t("Complete Academic", "منهج أكاديمي", "Manhaj Akademi")}
            <br />
            <span className="shimmer-text">{t("Curriculum Online", "شامل عبر الإنترنت", "Buuxa Online ah")}</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={0.1}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t(
              "From Primary school to University level — structured courses, AI tutoring, quizzes, and verified certificates. Learn in English, Arabic & Somali.",
              "من المرحلة الابتدائية إلى مستوى الجامعة — دورات منظمة وتدريب ذكي واختبارات وشهادات.",
              "Dugsiga Hoose ilaa Jaamacad — koorsooyinka qaab-dhismeedka, AI tababar, imtixaanad, iyo shahaadooyin."
            )}
          </motion.p>
        </div>
      </section>

      {/* ── Primary School Subjects ── */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <h2 className="font-black text-foreground text-xl">
                {t("Primary School", "المرحلة الابتدائية", "Dugsiga Hoose")}
                <span className="ml-2 px-2.5 py-0.5 rounded-full bg-green-500/15 text-green-400 text-xs font-bold">
                  {t("Ages 6–12", "العمر 6-12", "Da'da 6-12")}
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("Core subjects covering the full primary curriculum", "المواد الأساسية التي تغطي المنهج الابتدائي الكامل", "Maaddooyinka aasaasiga ah ee manhajka hoose")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
            {PRIMARY_SUBJECTS.map((s, i) => (
              <div key={i}
                className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl ${s.bg} border border-white/8 text-center flex flex-col items-center gap-1.5 sm:gap-2 cursor-pointer transition-all`}>
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                  <s.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-semibold text-foreground leading-tight">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Secondary School */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="font-black text-foreground text-xl">
                {t("Secondary School", "المرحلة الثانوية", "Dugsiga Sare")}
                <span className="ml-2 px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-xs font-bold">
                  {t("Ages 13–18", "العمر 13-18", "Da'da 13-18")}
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("Advanced subjects for secondary school students", "المواد المتقدمة للطلاب في المرحلة الثانوية", "Maaddooyinka horumarsan ee ardayda dugsiga sare")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 sm:gap-3">
            {SECONDARY_SUBJECTS.map((s, i) => (
              <div key={i}
                className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl ${s.bg} border border-white/8 text-center flex flex-col items-center gap-1.5 sm:gap-2 cursor-pointer transition-all`}>
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                  <s.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-semibold text-foreground leading-tight">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* University */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h2 className="font-black text-foreground text-xl">
                {t("University Level", "مستوى الجامعة", "Heerka Jaamacadda")}
                <span className="ml-2 px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 text-xs font-bold">
                  {t("18+", "18+", "18+")}
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("University-level depth for advanced learners and professionals", "مستوى جامعي للمتعلمين المتقدمين والمحترفين", "Heerka jaamacadda ee barayaasha horumarsan")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {UNIVERSITY_SUBJECTS.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i * 0.05}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`p-4 rounded-2xl ${s.bg} border border-white/8 flex items-center gap-3 cursor-pointer transition-all`}>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0`}>
                  <s.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold text-foreground">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Filter Tabs + Search ── */}
      <section className="sticky top-16 z-30 border-y border-border/50 bg-background/98 sm:bg-background/95 sm:backdrop-blur-xl" style={{ transform: "translateZ(0)" }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-nowrap w-full sm:w-auto">
            {TABS.map(tab => (
              <motion.button key={tab.key} onClick={() => setActiveTab(tab.key)}
                whileTap={{ scale: 0.96 }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}>
                {language === "ar" ? tab.ar : language === "so" ? tab.so : tab.en}
              </motion.button>
            ))}
          </div>

          <div className="relative flex-1 w-full sm:w-auto max-w-xs ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("Search subjects...", "بحث في المواد...", "Raadi maaddooyinka...")}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full bg-card border border-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Course Grid ── */}
      <section className="max-w-7xl mx-auto px-4 py-10 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-foreground text-lg">
            {filteredCourses.length} {t("Courses", "دورة", "Koorso")}
          </h2>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            {t("All include certificates", "الجميع يتضمن شهادات", "Dhammaan waxaa ku jira shahaadooyin")}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredCourses.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">{t("No courses found", "لا توجد دورات", "Koorso lama helin")}</p>
              <p className="text-sm mt-1">{t("Try a different filter or search term", "جرب فلتراً مختلفاً", "Tijaabi shaandhee kale")}</p>
            </motion.div>
          ) : (
            <motion.div key="grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredCourses.map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 flex flex-col items-center gap-4 text-center">
          <div>
            <h3 className="font-black text-foreground text-lg sm:text-xl mb-1">
              {t("Want to track your progress?", "هل تريد تتبع تقدمك؟", "Rabtaa inaad horumarkagaada la socotid?")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("Sign in to unlock quizzes, certificates, and the full curriculum.", "سجل الدخول لفتح الاختبارات والشهادات والمنهج الكامل.", "Gal si aad u furtid imtixaanadda, shahaadooyinka, iyo manhajka buuxa.")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <div className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(59,130,246,0.35)]">
                <Sparkles className="w-4 h-4 shrink-0" />
                {t("Get Started Free", "ابدأ مجاناً", "Bilaash Bilow")}
              </div>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <div className="px-6 py-3 rounded-full border border-white/20 text-foreground text-sm font-bold flex items-center justify-center hover:bg-white/5 transition-colors">
                {t("View Pricing", "عرض الأسعار", "Qiimaha Arag")}
              </div>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
