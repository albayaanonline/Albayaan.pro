import { motion } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[100dvh] pt-16 flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center px-4 max-w-lg mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="text-[8rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400/40 to-purple-500/40 select-none">
            404
          </div>
        </motion.div>

        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <Search className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-foreground mb-3">
          {t("Page not found", "الصفحة غير موجودة", "Bogga lama helin")}
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {t(
            "The page you're looking for doesn't exist or has been moved.",
            "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
            "Bogga aad raadinaysid ma jiro ama waa la wareejiyay."
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
          >
            <Home className="w-4 h-4" />
            {t("Go Home", "العودة للرئيسية", "Ku Noqo Bogga Hore")}
          </Link>
          <Link
            href="/courses"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("Browse Courses", "تصفح الدورات", "Baadh Koorsooyinka")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
