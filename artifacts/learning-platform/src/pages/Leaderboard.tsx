import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Link } from "wouter";
import { Trophy, Medal, Star, Zap, Flame, Crown, TrendingUp, Loader2 } from "lucide-react";

const fadeUp: any = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05 } }),
};

interface Leader {
  rank: number; name: string; xp: number; level: number;
  streak: number; courses: number; badges: string[];
}

const TOP3_CONFIG = [
  { rank: 2, color: "from-gray-400 to-gray-500",    glow: "rgba(156,163,175,0.4)", height: "h-24" },
  { rank: 1, color: "from-yellow-400 to-amber-500", glow: "rgba(251,191,36,0.5)",  height: "h-32" },
  { rank: 3, color: "from-orange-400 to-amber-600", glow: "rgba(251,146,60,0.4)",  height: "h-20" },
];

const RANK_BADGE: Record<number, string> = { 1: "🏆", 2: "🥈", 3: "🥉" };

function getRankColor(rank: number) {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-300";
  if (rank === 3) return "text-orange-400";
  return "text-muted-foreground";
}

export default function Leaderboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then(r => r.ok ? r.json() : [])
      .then((data: Leader[]) => {
        if (data.length === 0) {
          setLeaders([
            { rank: 1, name: "Ahmed Mohamed",  xp: 14250, level: 10, streak: 28, courses: 6, badges: ["7-day-streak", "xp-1000"] },
            { rank: 2, name: "Faadumo Hassan", xp: 12800, level: 9,  streak: 21, courses: 5, badges: ["7-day-streak"] },
            { rank: 3, name: "Omar Abdullah",  xp: 11600, level: 8,  streak: 19, courses: 5, badges: ["xp-1000"] },
            { rank: 4, name: "Hodan Abdi",     xp: 9850,  level: 7,  streak: 15, courses: 4, badges: [] },
            { rank: 5, name: "Yusuf Ibrahim",  xp: 8900,  level: 6,  streak: 14, courses: 4, badges: [] },
          ]);
        } else {
          setLeaders(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const top3 = leaders.slice(0, 3);
  const rest  = leaders.slice(3);

  const myRank = user ? leaders.findIndex(l => l.name === user.name) + 1 : 0;

  return (
    <div className="w-full bg-background min-h-screen">

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
            {t("Compete, earn XP, and rise through the ranks!", "تنافس واكسب نقاط XP وارتقِ في الرتب!", "La tartam, XP kasb, oo derejooyinka kor u kac!")}
          </motion.p>
          {myRank > 0 && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.3}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
              <Star className="w-4 h-4" /> Your rank: #{myRank}
            </motion.div>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Podium */}
            {top3.length >= 3 && (
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.3}
                className="flex items-end justify-center gap-4 mb-12 px-4">
                {TOP3_CONFIG.map(({ rank, color, glow, height }) => {
                  const leader = top3.find(l => l.rank === rank);
                  if (!leader) return null;
                  return (
                    <div key={rank} className="flex flex-col items-center gap-3 flex-1 max-w-[140px]">
                      <div className="text-center">
                        <div className="text-2xl mb-1">{RANK_BADGE[rank]}</div>
                        <div className="font-bold text-white text-sm leading-tight line-clamp-1">{leader.name}</div>
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          <span className="text-yellow-400 font-bold">{leader.xp.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className={`w-full ${height} rounded-t-2xl bg-gradient-to-b ${color} flex items-center justify-center`}
                        style={{ boxShadow: `0 -4px 20px ${glow}` }}>
                        <span className="text-2xl font-black text-white">{rank}</span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Full list */}
            <div className="space-y-2">
              {leaders.map((leader, i) => (
                <motion.div key={leader.rank} initial="hidden" animate="visible" variants={fadeUp} custom={0.35 + i * 0.03}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    leader.rank <= 3
                      ? "bg-gradient-to-r from-yellow-500/5 to-transparent border-yellow-500/15"
                      : "bg-card border-white/10 hover:border-white/20"
                  }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shrink-0 ${
                    leader.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                    leader.rank === 2 ? "bg-gray-400/20 text-gray-300" :
                    leader.rank === 3 ? "bg-orange-500/20 text-orange-400" :
                    "bg-white/5 text-muted-foreground"
                  }`}>
                    {leader.rank <= 3 ? RANK_BADGE[leader.rank] : leader.rank}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm">{leader.name}</div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Star className="w-3 h-3 text-blue-400" /> Lv {leader.level}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-400" /> {leader.streak}d
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-400" /> {leader.courses} courses
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-yellow-400 font-black">
                      <Zap className="w-4 h-4" />
                      {leader.xp.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">XP</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {!user && (
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.6}
                className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-900/20 border border-primary/20 text-center">
                <Crown className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                <h3 className="font-black text-white text-lg mb-2">{t("Join the Leaderboard!", "انضم إلى القائمة!", "Ku soo biir liishka!")}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t("Enroll in courses, complete exercises, and earn XP to climb the rankings!", "سجّل في الدورات وأكمل التمارين لكسب نقاط XP!", "Diiwaanso koorsooyin, tababarka dhamee, XP kasbo!")}</p>
                <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/80 transition-colors">
                  {t("Get Started", "ابدأ الآن", "Bilow Hadda")} →
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
