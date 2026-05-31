import { Router, type IRouter } from "express";
import { eq, desc, count } from "drizzle-orm";
import {
  db, userGamificationTable, usersTable, lessonProgressTable,
  courseEnrollmentsTable,
} from "@workspace/db";
import { verifySupabaseToken, getBearerToken } from "../middleware/auth";

const router: IRouter = Router();

async function getAuthUserId(req: any, res: any): Promise<number | null> {
  const token = getBearerToken(req);
  if (token) {
    const su = await verifySupabaseToken(token);
    if (su) {
      const [u] = await db.select().from(usersTable).where(eq(usersTable.email, su.email));
      if (u) return u.id;
    }
  }
  if (req.session?.userId) return req.session.userId as number;
  res.status(401).json({ error: "Unauthorized" });
  return null;
}

function xpToLevel(xp: number) {
  if (xp < 100)  return 1;
  if (xp < 250)  return 2;
  if (xp < 500)  return 3;
  if (xp < 1000) return 4;
  if (xp < 1750) return 5;
  if (xp < 2750) return 6;
  if (xp < 4000) return 7;
  if (xp < 5500) return 8;
  if (xp < 7500) return 9;
  if (xp < 10000) return 10;
  return Math.min(20, Math.floor(10 + (xp - 10000) / 2000));
}

function xpForLevel(level: number) {
  const thresholds = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000];
  if (level <= 10) return thresholds[level] ?? 10000;
  return 10000 + (level - 10) * 2000;
}

async function ensureGamification(userId: number) {
  const [existing] = await db.select().from(userGamificationTable).where(eq(userGamificationTable.userId, userId));
  if (!existing) {
    await db.insert(userGamificationTable).values({ userId });
    const [fresh] = await db.select().from(userGamificationTable).where(eq(userGamificationTable.userId, userId));
    return fresh!;
  }
  return existing;
}

router.get("/gamification", async (req, res): Promise<void> => {
  const userId = await getAuthUserId(req, res);
  if (!userId) return;

  const g = await ensureGamification(userId);
  const level = xpToLevel(g.xp);
  const nextLevelXp = xpForLevel(level + 1);
  const currentLevelXp = xpForLevel(level);
  const xpIntoLevel = g.xp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;

  res.json({
    xp: g.xp,
    level,
    streak: g.streak,
    badges: g.badges,
    totalExercises: g.totalExercises,
    correctAnswers: g.correctAnswers,
    nextLevelXp,
    currentLevelXp,
    xpIntoLevel,
    xpNeeded,
    progressPct: Math.round((xpIntoLevel / xpNeeded) * 100),
  });
});

router.post("/gamification/award", async (req, res): Promise<void> => {
  const userId = await getAuthUserId(req, res);
  if (!userId) return;

  const { xp = 0, reason = "" } = req.body;
  if (typeof xp !== "number" || xp <= 0 || xp > 200) {
    res.status(400).json({ error: "Invalid XP amount" });
    return;
  }

  const g = await ensureGamification(userId);

  const today = new Date().toISOString().slice(0, 10);
  const lastActive = g.lastActiveDate ?? "";
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let newStreak = g.streak;
  if (lastActive === today) {
    // same day, streak unchanged
  } else if (lastActive === yesterday) {
    newStreak = g.streak + 1;
  } else {
    newStreak = 1;
  }

  const newXp = g.xp + xp;
  const newLevel = xpToLevel(newXp);

  const currentBadges = new Set(g.badges);
  if (newStreak >= 7 && !currentBadges.has("7-day-streak"))  currentBadges.add("7-day-streak");
  if (newStreak >= 30 && !currentBadges.has("30-day-streak")) currentBadges.add("30-day-streak");
  if (newXp >= 1000 && !currentBadges.has("xp-1000"))        currentBadges.add("xp-1000");
  if (newXp >= 5000 && !currentBadges.has("xp-5000"))        currentBadges.add("xp-5000");
  if (newLevel >= 5 && !currentBadges.has("level-5"))        currentBadges.add("level-5");
  if (newLevel >= 10 && !currentBadges.has("level-10"))      currentBadges.add("level-10");

  await db.update(userGamificationTable)
    .set({ xp: newXp, level: newLevel, streak: newStreak, lastActiveDate: today, badges: [...currentBadges], updatedAt: new Date() })
    .where(eq(userGamificationTable.userId, userId));

  res.json({ xp: newXp, level: newLevel, streak: newStreak, gained: xp, leveledUp: newLevel > g.level });
});

router.get("/leaderboard", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(userGamificationTable)
    .orderBy(desc(userGamificationTable.xp))
    .limit(20);

  const result = await Promise.all(
    rows.map(async (g, i) => {
      const [u] = await db.select().from(usersTable).where(eq(usersTable.id, g.userId));
      const [{ cnt: courses }] = await db
        .select({ cnt: count(courseEnrollmentsTable.id) })
        .from(courseEnrollmentsTable)
        .where(eq(courseEnrollmentsTable.userId, g.userId));
      return {
        rank:     i + 1,
        name:     u?.name ?? "Student",
        xp:       g.xp,
        level:    xpToLevel(g.xp),
        streak:   g.streak,
        courses:  Number(courses),
        badges:   g.badges,
      };
    })
  );

  res.json(result);
});

export default router;
