import { useGetCourse } from "@workspace/api-client-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { PlayCircle, Lock, CheckCircle } from "lucide-react";

export default function CourseDetail() {
  const { courseId } = useParams();
  const { data: course, isLoading } = useGetCourse(Number(courseId), {
    query: { enabled: !!courseId }
  });
  const { t, language } = useLanguage();

  if (isLoading || !course) {
    return <div className="p-8 text-center text-primary">Loading...</div>;
  }

  const getTitle = (item: any) => language === "ar" ? item.titleAr : language === "so" ? item.titleSo : item.title;
  const getDesc = (item: any) => language === "ar" ? item.descriptionAr : language === "so" ? item.descriptionSo : item.description;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{getTitle(course)}</h1>
            <p className="text-lg text-muted-foreground">{getDesc(course)}</p>
          </motion.div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-4">{t("Lessons", "الدروس", "Casharrada")}</h3>
            {course.lessons?.map((lesson: any, i: number) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    {lesson.isLocked ? <Lock className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{getTitle(lesson)}</h4>
                    <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                  </div>
                </div>
                {!lesson.isLocked ? (
                  <Link href={`/learn/${course.id}/${lesson.id}`} className="text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("Watch", "مشاهدة", "Daawo")}
                  </Link>
                ) : null}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="sticky top-24 p-6 rounded-2xl bg-card border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          >
            <div className="text-4xl font-black text-white mb-6">${course.price}</div>
            
            <div className="space-y-4 mb-8">
              <Link href={`/payment/${course.id}`} className="block w-full text-center py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all">
                {t("Enroll Now", "سجل الآن", "Hadda Is Diiwaangeli")}
              </Link>
              <Link href="/access-code" className="block w-full text-center py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">
                {t("I have an access code", "لدي رمز دخول", "Waxaan hayaa koodh")}
              </Link>
            </div>

            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400"/> {course.lessonCount} {t("Lessons", "دروس", "Cashar")}</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400"/> {course.duration} {t("of video", "من الفيديو", "oo muuqaal ah")}</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400"/> {t("Certificate of completion", "شهادة إتمام", "Shahaadada dhamaystirka")}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
