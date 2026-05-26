import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useGetCourses, useGetUserProgress } from "@/lib/api-client";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  Award, Download, Search, Shield, CheckCircle, Calendar, Star,
  BookOpen, ArrowRight, Loader2, Lock, Trophy, ExternalLink,
} from "lucide-react";

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

export default function MyCertificates() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { data: courses, isLoading: coursesLoading } = useGetCourses();
  const { data: progress, isLoading: progressLoading } = useGetUserProgress();
  const [search, setSearch] = useState("");

  const isLoading = coursesLoading || progressLoading;

  const getTitle = (item: any) =>
    language === "ar" ? item?.titleAr : language === "so" ? item?.titleSo : item?.title;

  const completedCourses = (courses ?? []).filter((c: any) => {
    const p = (progress as any[])?.find((p: any) => String(p.courseId) === String(c.id));
    return (p?.percentComplete ?? 0) >= 100;
  });

  const inProgressCourses = (courses ?? []).filter((c: any) => {
    const p = (progress as any[])?.find((p: any) => String(p.courseId) === String(c.id));
    const pct = p?.percentComplete ?? 0;
    return pct > 0 && pct < 100;
  });

  const filtered = completedCourses.filter((c: any) => {
    const title = getTitle(c) || c?.title || "";
    return title.toLowerCase().includes(search.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t("Loading certificates...", "جارٍ تحميل الشهادات...", "Shahaadooyinka la rarayo...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-sm font-medium text-yellow-400 mb-4">
            <Trophy className="w-4 h-4" />
            {t("Your Achievements", "إنجازاتك", "Guulahaga")}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-3">
            {t("My Certificates", "شهاداتي", "Shahaadooyinkayga")}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            {t(
              "All your earned certificates in one place. Download, share, or verify your credentials.",
              "جميع شهاداتك المكتسبة في مكان واحد. حمّل أو شارك أو تحقق من بياناتك الاعتمادية.",
              "Dhammaan shahaadooyinkaada la helay hal meel. Soo deg, la wadaag, ama xaqiiji."
            )}
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.1}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Award,        label: t("Certificates Earned",   "شهادات مكتسبة",   "Shahaadooyin la helay"),  value: completedCourses.length, color: "text-yellow-400",  bg: "bg-yellow-500/10" },
            { icon: BookOpen,     label: t("Courses In Progress",   "دورات جارية",     "Koorsooyinka Socda"),      value: inProgressCourses.length, color: "text-blue-400",   bg: "bg-blue-500/10" },
            { icon: Shield,       label: t("Verified Credentials",  "بيانات موثقة",    "Xog Xaqiijisan"),           value: completedCourses.length, color: "text-green-400",  bg: "bg-green-500/10" },
            { icon: Star,         label: t("Avg Course Rating",     "متوسط تقييم الدورات","Celceliska Qiimaynta"), value: "4.9★",                   color: "text-purple-400", bg: "bg-purple-500/10" },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-2xl bg-card border border-white/10">
              <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-2`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-2xl font-black text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.15}
          className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("Search certificates...", "ابحث في الشهادات...", "Shahaadooyinka raadi...")}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 text-sm"
          />
        </motion.div>

        {/* Certificates grid */}
        {filtered.length === 0 ? (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.2}
            className="text-center py-20">
            <div className="w-24 h-24 rounded-3xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-yellow-400/60" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-3">
              {search ? t("No certificates found", "لم يتم العثور على شهادات", "Shahaadooyin lama helin") : t("No certificates yet", "لا توجد شهادات بعد", "Shahaadooyin malaha weli")}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {t(
                "Complete a course to earn your first certificate!",
                "أكمل دورة لتحصل على شهادتك الأولى!",
                "Koorso dhameyso si aad shahaadadaada ugu hesho!"
              )}
            </p>
            <Link href="/courses">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm">
                {t("Browse Courses", "تصفح الدورات", "Baadh Koorsooyinka")}
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((course: any, i: number) => {
              const certId = user
                ? generateCertId(user.email || String(user.id), String(course.id))
                : "ALBAYAAN-XXXX-XXXX-2026";
              const title = getTitle(course) || course.title;
              const completionDate = new Date().toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              });

              return (
                <motion.div key={course.id} initial="hidden" animate="visible"
                  variants={fadeUp} custom={i * 0.05}
                  whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
                  className="rounded-2xl bg-card border border-white/10 hover:border-yellow-500/30 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-all duration-300 overflow-hidden">

                  {/* Certificate preview */}
                  <div className="relative p-6 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border-b border-white/5">
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs font-bold text-green-400">
                        <CheckCircle className="w-3 h-3" /> {t("Verified", "موثق", "Xaqiijisan")}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shrink-0 shadow-lg">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-yellow-400 font-bold uppercase tracking-widest mb-1">
                          {t("Certificate of Completion", "شهادة إتمام", "Shahaadada Dhamaystirka")}
                        </div>
                        <h3 className="font-black text-foreground text-sm leading-tight">{title}</h3>
                        {course.instructor && (
                          <p className="text-xs text-muted-foreground mt-1">by {course.instructor}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-muted-foreground mb-0.5">{t("Issued to", "صدر لـ", "Bixiyay")}</div>
                        <div className="font-semibold text-foreground">{user?.name || "Student"}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-0.5">{t("Issued on", "صدر في", "Taariikhda")}</div>
                        <div className="font-semibold text-foreground">{completionDate}</div>
                      </div>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3 text-primary shrink-0" />
                      <span className="font-mono">{certId}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/certificate/${course.id}`} className="flex-1">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-xs">
                          <Download className="w-3.5 h-3.5" />
                          {t("Download PDF", "تحميل PDF", "PDF Soo Deg")}
                        </motion.div>
                      </Link>
                      <Link href={`/verify/${certId}`}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground font-bold text-xs hover:bg-white/10 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                          {t("Verify", "تحقق", "Xaqiiji")}
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* In Progress Section */}
        {inProgressCourses.length > 0 && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0} className="mt-16">
            <h2 className="text-xl font-black text-foreground mb-5 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              {t("Continue to Earn Certificates", "أكمل لتحصل على شهادات", "Koorsooyinka Dhamaystir si aad Shahaadooyin u Hesho")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {inProgressCourses.slice(0, 3).map((course: any, i: number) => {
                const p = (progress as any[])?.find((p: any) => String(p.courseId) === String(course.id));
                const pct = p?.percentComplete ?? 0;
                const title = getTitle(course) || course.title;
                return (
                  <motion.div key={course.id} variants={fadeUp} custom={i}
                    className="p-4 rounded-2xl bg-card border border-white/10 flex items-center gap-4">
                    <div className="relative w-12 h-12 shrink-0">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#ffffff10" strokeWidth="3" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke="url(#grad)" strokeWidth="3"
                          strokeDasharray={`${pct * 0.879} 87.9`} strokeLinecap="round" />
                        <defs>
                          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-primary">{pct}%</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground text-sm truncate">{title}</div>
                      <div className="text-xs text-muted-foreground">
                        {t("Keep going to earn your certificate!", "استمر لتحصل على شهادتك!", "Sii wad si aad shahaadada u hesho!")}
                      </div>
                    </div>
                    <Link href={`/courses/${course.id}`}>
                      <div className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors">
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Verification CTA */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp} custom={0} className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-center">
          <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-foreground mb-2">
            {t("Certificate Verification", "التحقق من الشهادة", "Xaqiijinta Shahaadada")}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
            {t(
              "Share your certificate verification link with employers or institutions to prove your credentials.",
              "شارك رابط التحقق من شهادتك مع أصحاب العمل أو المؤسسات لإثبات بياناتك الاعتمادية.",
              "La wadaag xiriirka xaqiijinta shahaadadaada shaqaale bixiyeyaasha ama hay'adaha."
            )}
          </p>
          <Link href="/verify">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm">
              <Shield className="w-4 h-4" />
              {t("Verify a Certificate", "تحقق من شهادة", "Shahaado Xaqiiji")}
            </motion.div>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
