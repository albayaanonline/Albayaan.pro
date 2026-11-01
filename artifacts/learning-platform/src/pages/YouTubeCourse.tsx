import { ArrowLeft, BookOpen, ExternalLink, Globe, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { YOUTUBE_COURSES } from "@/data/youtubeCourses";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function YouTubeCourse() {
  const { slug } = useParams();
  const { language, t, dir } = useLanguage();
  const course = YOUTUBE_COURSES.find((item) => item.slug === slug);

  if (!course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <Youtube className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-foreground">
          {t("Playlist not found", "قائمة التشغيل غير موجودة", "Liiska casharrada lama helin")}
        </h1>
        <Link
          href="/courses"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("Back to Courses", "العودة إلى الدورات", "Ku noqo koorsooyinka")}
        </Link>
      </div>
    );
  }

  const title = course.title[language];
  const description = course.description[language];
  const playlistUrl = `https://www.youtube.com/playlist?list=${course.playlistId}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/videoseries?list=${course.playlistId}&rel=0`;

  return (
    <main dir={dir} className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("All Courses", "جميع الدورات", "Dhammaan koorsooyinka")}
        </Link>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="space-y-6 min-w-0">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-medium mb-4">
                <Youtube className="w-4 h-4" />
                {t("YouTube course playlist", "قائمة دورة على يوتيوب", "Liis koorso YouTube ah")}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight mb-4">
                {title}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
                {description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
            >
              <iframe
                src={embedUrl}
                title={title}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {t(
                "Videos are streamed from YouTube and remain hosted by their original creators. Availability and playback are controlled by YouTube.",
                "تُعرض الفيديوهات من يوتيوب وتبقى مستضافة لدى منشئيها الأصليين. يوتيوب هو المسؤول عن توفرها وتشغيلها.",
                "Muuqaallada YouTube ayaa laga daawanayaa, waxaana martigeliya abuureyaashooda. YouTube ayaa maamula helitaankooda iyo ciyaarintooda."
              )}
            </p>
          </section>

          <aside className="h-fit p-6 rounded-2xl bg-card border border-white/10 lg:sticky lg:top-24">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <Youtube className="w-5 h-5 text-red-400" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-foreground">
                  {t("Playlist source", "مصدر قائمة التشغيل", "Isha liiska")}
                </h2>
                <p className="text-sm text-muted-foreground break-words">{course.sourceChannel}</p>
              </div>
            </div>

            <div className="space-y-3 border-y border-white/10 py-4 mb-5">
              <div className="flex items-center gap-3 text-sm">
                <Globe className="w-4 h-4 text-primary shrink-0" />
                <span className="text-muted-foreground">
                  {course.language === "arabic"
                    ? t("Arabic", "العربية", "Carabi")
                    : t("English", "الإنجليزية", "Ingiriisi")}
                </span>
              </div>
              {course.lessonCount && (
                <div className="flex items-center gap-3 text-sm">
                  <BookOpen className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">
                    {course.lessonCount} {t("videos in playlist", "فيديو في القائمة", "muuqaal oo liiska ku jira")}
                  </span>
                </div>
              )}
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {t("Original playlist:", "قائمة التشغيل الأصلية:", "Liiska asalka ah:")}{" "}
                <span className="text-foreground">{course.sourceTitle}</span>
              </p>
            </div>

            <a
              href={playlistUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
            >
              <Youtube className="w-4 h-4" />
              {t("Open full playlist", "افتح قائمة التشغيل كاملة", "Fur liiska oo dhan")}
              <ExternalLink className="w-4 h-4" />
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}
