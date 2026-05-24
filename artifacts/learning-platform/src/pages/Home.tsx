import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Link } from "wouter";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[100dvh] pt-16 flex flex-col relative overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 w-full flex flex-col items-center justify-center text-center z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-300 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {t("Next-gen learning platform", "منصة التعلم من الجيل القادم", "Madal waxbarasho casri ah")}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">English & Arabic</span> <br className="hidden md:block"/> at the speed of thought.
          </h1>
          
          <p className="text-lg md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
            {t(
              "A premium futuristic online learning experience designed for you. Enter your code or enroll now.",
              "تجربة تعلم عبر الإنترنت مستقبلية ومميزة مصممة لك. أدخل الرمز الخاص بك أو سجل الآن.",
              "Khibrad waxbarasho oo casri ah oo loogu talagalay adiga. Geli koodhkaaga ama is diiwaangeli hadda."
            )}
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/courses" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-100 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              {t("Explore Courses", "استكشف الدورات", "Sahmi Koorsooyinka")}
            </Link>
            <Link href="/access-code" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-colors backdrop-blur-sm">
              {t("Redeem Code", "استرداد الرمز", "Furo Koodhka")}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
