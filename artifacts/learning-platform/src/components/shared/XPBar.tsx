import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Flame, Star } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";

interface GamificationData {
  xp: number; level: number; streak: number;
  progressPct: number; xpIntoLevel: number; xpNeeded: number;
  badges: string[];
}

export function useGamification() {
  const { user } = useAuth();
  const [data, setData] = useState<GamificationData | null>(null);

  const refresh = () => {
    if (!user) return;
    fetch("/api/gamification", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setData(d))
      .catch(() => {});
  };

  useEffect(() => { refresh(); }, [user?.id]);

  return { data, refresh };
}

export function XPToast({ xp, onDone }: { xp: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.8 }}
      className="fixed bottom-8 right-6 z-50 flex items-center gap-2.5 px-5 py-3
        rounded-2xl bg-gradient-to-r from-yellow-500/90 to-orange-500/90
        text-white font-black text-base shadow-2xl backdrop-blur-sm
        border border-yellow-400/30"
    >
      <Zap className="w-5 h-5" />
      +{xp} XP
    </motion.div>
  );
}

export function GamificationMini() {
  const { data } = useGamification();
  if (!data) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
        <Flame className="w-3.5 h-3.5 text-orange-400" />
        <span className="text-xs font-bold text-orange-400">{data.streak}</span>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
        <Zap className="w-3.5 h-3.5 text-purple-400" />
        <span className="text-xs font-bold text-purple-400">{data.xp.toLocaleString()} XP</span>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
        <Star className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-xs font-bold text-blue-400">Lv {data.level}</span>
      </div>
    </div>
  );
}

export function LevelCard({ data }: { data: GamificationData }) {
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-purple-300 font-semibold uppercase tracking-widest mb-1">Level</div>
          <div className="text-3xl font-black text-white">{data.level}</div>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
          <Star className="w-7 h-7 text-white" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{data.xpIntoLevel.toLocaleString()} XP</span>
          <span>{data.xpNeeded.toLocaleString()} XP</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.progressPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
          />
        </div>
        <div className="text-xs text-muted-foreground text-right">{data.progressPct}% to Level {data.level + 1}</div>
      </div>
    </div>
  );
}

const BADGE_DEFS: Record<string, { icon: string; label: string; color: string }> = {
  "7-day-streak":  { icon: "🔥", label: "7-Day Streak",   color: "from-orange-500 to-red-600" },
  "30-day-streak": { icon: "⚡", label: "30-Day Streak",  color: "from-yellow-500 to-orange-600" },
  "xp-1000":       { icon: "⭐", label: "1K XP Club",    color: "from-blue-500 to-purple-600" },
  "xp-5000":       { icon: "💎", label: "5K XP Master",  color: "from-purple-500 to-pink-600" },
  "level-5":       { icon: "🏅", label: "Level 5",       color: "from-green-500 to-teal-600" },
  "level-10":      { icon: "🏆", label: "Level 10",      color: "from-yellow-400 to-amber-600" },
  "first-lesson":  { icon: "📚", label: "First Lesson",  color: "from-blue-400 to-blue-600" },
  "course-done":   { icon: "🎓", label: "Grad. Cap",     color: "from-green-400 to-emerald-600" },
};

export function BadgesGrid({ badges }: { badges: string[] }) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        Complete exercises and maintain streaks to earn badges!
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map(b => {
        const def = BADGE_DEFS[b] ?? { icon: "🏆", label: b, color: "from-gray-500 to-gray-600" };
        return (
          <div key={b} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${def.color} text-white text-xs font-bold`}>
            <span>{def.icon}</span>
            {def.label}
          </div>
        );
      })}
    </div>
  );
}
