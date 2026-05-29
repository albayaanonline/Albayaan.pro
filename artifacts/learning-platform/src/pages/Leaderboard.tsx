import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Link } from "wouter";
import { Trophy, Medal, Star, Zap, Flame, Crown, ArrowRight, TrendingUp } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05 } }),
};

const MOCK_LEADERS = [
  { rank: 1,  name: "Ahmed Mohamed",    xp: 14250, streak: 28, courses: 6, badge: "🏆", country: "🇸🇴" },
  { rank: 2,  name: "Faadumo Hassan",   xp: 12800, streak: 21, courses: 5, badge: "🥈", country: "🇸🇴" },
  { rank: 3,  name: "Omar Abdullah",    xp: 11600, streak: 19, courses: 5, badge: "🥉", country: "🇬🇧" },
  { rank: 4,  name: "Hodan Abdi",       xp: 9850,  streak: 15, courses: 4, badge: "⭐", country: "🇸🇴" },
  { rank: 5,  name: "Yusuf Ibrahim",    xp: 8900,  streak: 14, courses: 4, badge: "⭐", country: "🇺🇸" },
  { rank: 6,  name: "Nasra Ali",        xp: 7750,  streak: 12, courses: 3, badge: "⭐", country: "🇸🇴" },
  { rank: 7,  name: "Abdi Rahman",      xp: 6800,  streak: 11, courses: 3, badge: "⭐", country: "🇸🇴" },
  { rank: 8,  name: "Halima Warsame",   xp: 5900,  streak: 9,  courses: 3, badge: "⭐", country: "🇸🇪" },
  { rank: 9,  name: "Mukhtar Farah",    xp: 5200,  streak: 8,  courses: 2, badge: "⭐", country: "🇸🇴" },
  { rank: 10, name: "Roda Hassan",      xp: 4600,  streak: 7,  courses: 2, badge: "⭐", country: "🇸🇴" },
];

const TOP3_CONFIG = [
  { rank: 2, color: "from-gray-400 to-gray-500",    glow: "rgba(156,163,175,0.4)", height: "h-24" },
  { rank: 1, color: "from-yellow-400 to-amber-500", glow: "rgba(251,191,36,0.5)",  height: "h-32" },
  { rank: 3, color: "from-orange-400 to-amber-600", glow: "rgba(251,146,60,0.4)",  height: "h-20" },
];

export default function Leaderboard() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const top3Order = [MOCK_LEADERS[1], MOCK_LEADERS[0], MOCK_LEADERS[2]];

  return (
    <div className="w-full bg-background min-h-screen">

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-yellow-500/10 rounded-full blur-[80px] animate-glow-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/8 rounded-full blur-[70px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-sm font-medium text-yellow-400 mb-6">
            <Trophy className="w-4 h-4" />
            {t("Live Rankings", "التصنيفات الحية", "Qiimaynta Nool")}
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0.1}
            className="text-4xl md:text-6xl font-black text-foreground mb-4 leading-tight">
            {t("Student", "بطولة", "Tartanka")}
            <span className="shimmer-text mx-3">{t("Leaderboard", "الطلاب", "Ardayda")}</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={0.2}
            className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t(
              "Compete, learn, and earn XP. Top students win exclusive badges and recognition.",
              "تنافس وتعلم واكسب نقاط XP. أفضل الطلاب يفوزون بشارات حصرية.",
              "Is tartam, baro, oo XP hel. Ardayda ugu horreeysa waxay helaan astaamaha gaar ah."
            )}
          </motion.p>
        </div>
      </section>

      {/* ── Top 3 Podium ── */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <div className="flex items-end justify-center gap-4">
          {TOP3_CONFIG.map((cfg, idx) => {
            const player = top3Order[idx];
            return (
              <motion.div key={cfg.rank} initial="hidden" animate="visible" variants={fadeUp} custom={idx * 0.1}
                className="flex-1 max-w-[180px] flex flex-col items-center">
                <div className="relative mb-3">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${cfg.color} flex items-center justify-center text-2xl font-black text-white shadow-lg`}
                    style={{ boxShadow: `0 0 30px ${cfg.glow}` }}>
                    {player.badge}
                  </div>
                  {cfg.rank === 1 && (
                    <Crown className="w-6 h-6 text-yellow-400 absolute -top-3 left-1/2 -translate-x-1/2 animate-float" />
                  )}
                </div>
                <p className="text-sm font-black text-foreground text-center mb-1 truncate w-full text-center">{player.name}</p>
                <p className="text-xs text-primary font-bold mb-3">{player.xp.toLocaleString()} XP</p>
                <div className={`w-full ${cfg.height} rounded-t-2xl bg-gradient-to-b ${cfg.color} flex items-center justify-center`}
                  style={{ boxShadow: `0 -10px 30px ${cfg.glow}` }}>
                  <span className="text-2xl font-black text-white">#{cfg.rank}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Full Rankings Table ── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="rounded-2xl bg-card border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-black text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {t("Full Rankings", "التصنيف الكامل", "Qiimaynta Buuxda")}
            </h2>
            <span className="text-xs text-muted-foreground">
              {t("Updated daily", "يُحدّث يومياً", "Maalin kasta la cusboonaysiin")}
            </span>
          </div>

          {MOCK_LEADERS.map((player, i) => (
            <motion.div key={player.rank}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i * 0.04}
              className={`flex items-center gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors ${
                player.rank <= 3 ? "bg-yellow-500/3" : ""
              }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                player.rank === 1 ? "bg-yellow-400/20 text-yellow-400" :
                player.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                player.rank === 3 ? "bg-orange-400/20 text-orange-400" :
                "bg-white/5 text-muted-foreground"
              }`}>
                {player.rank}
              </div>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                {player.name[0]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm truncate">{player.name}</span>
                  <span className="text-base">{player.country}</span>
                  {player.rank <= 3 && <span className="text-base">{player.badge}</span>}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-orange-400">
                    <Flame className="w-3 h-3" /> {player.streak} {t("day streak", "يوم متتالٍ", "maalintii")}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3" /> {player.courses} {t("courses", "دورات", "koorso")}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  {player.xp.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">XP</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Your Rank Card ── */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.5}
          className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-primary/20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-black text-lg">
                {user ? user.name?.[0]?.toUpperCase() : "?"}
              </div>
              <div>
                <p className="font-bold text-foreground">
                  {user ? user.name : t("You (Guest)", "أنت (زائر)", "Adiga (Martida)")}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3 text-purple-400" />
                  {user ? t("Keep learning to climb the rankings!", "استمر في التعلم للتقدم في التصنيف!", "Sii wad barasho si aad u kor u gasho!") :
                         t("Sign in to track your rank", "سجل الدخول لتتابع تصنيفك", "Gal si aad qiimayntaada u raadiso")}
                </div>
              </div>
            </div>
            {!user ? (
              <Link href="/auth/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold flex items-center gap-2">
                  {t("Join Now", "انضم الآن", "Hadda Ku Biir")}
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            ) : (
              <Link href="/dashboard">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="px-5 py-2.5 rounded-xl bg-primary/15 text-primary text-sm font-bold flex items-center gap-2 border border-primary/20">
                  <Medal className="w-4 h-4" />
                  {t("My Dashboard", "لوحتي", "Dhaq-dhaqaaqayga")}
                </motion.div>
              </Link>
            )}
          </div>
        </motion.div>

        {/* ── XP Info ── */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.6}
          className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "📚", label: t("Complete a lesson", "أكمل درساً", "Casharka Dhamey"),     xp: "+25 XP" },
            { icon: "✅", label: t("Finish a course",   "أكمل دورة",  "Koorso Dhamey"),      xp: "+500 XP" },
            { icon: "🔥", label: t("Daily streak",      "يوم متتالٍ", "Maalin Joogto ah"),   xp: "+10 XP/day" },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-card border border-white/10 flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-sm font-black text-primary">{item.xp}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
