import { useGetCourses } from "@workspace/api-client-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Clock, Tag } from "lucide-react";

export default function Courses() {
  const { data: courses, isLoading } = useGetCourses();
  const { t, language } = useLanguage();

  const getTitle = (c: any) => language === "ar" ? c.titleAr : language === "so" ? c.titleSo : c.title;
  const getDesc = (c: any) => language === "ar" ? c.descriptionAr : language === "so" ? c.descriptionSo : c.description;

  if (isLoading) {
    return <div className="p-8 text-center text-primary">Loading courses...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-black mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
      >
        {t("Available Courses", "الدورات المتاحة", "Koorsooyinka la heli karo")}
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses?.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative rounded-2xl bg-card border border-white/10 overflow-hidden hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300"
          >
            <div className="aspect-video bg-white/5 relative overflow-hidden">
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt={getTitle(course)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white/20" />
                </div>
              )}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-white uppercase tracking-wider">
                {course.level}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{getTitle(course)}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-6">{getDesc(course)}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-1"><BookOpen className="w-4 h-4"/> {course.lessonCount} {t("Lessons", "دروس", "Cashar")}</div>
                <div className="flex items-center gap-1"><Clock className="w-4 h-4"/> {course.duration}</div>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="text-2xl font-black text-white">${course.price}</div>
                <Link href={`/courses/${course.id}`} className="px-6 py-2 rounded-full bg-primary/20 text-primary hover:bg-primary hover:text-white transition-colors font-medium text-sm border border-primary/50">
                  {t("View Details", "عرض التفاصيل", "Eeg Faahfaahinta")}
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
