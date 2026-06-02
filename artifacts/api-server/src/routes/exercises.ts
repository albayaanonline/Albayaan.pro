import { Router, type IRouter } from "express";
import { eq, and, asc } from "drizzle-orm";
import {
  db, exercisesTable, exerciseAttemptsTable, userGamificationTable,
  usersTable, lessonsTable,
} from "@workspace/db";
import { verifySupabaseToken, getBearerToken } from "../middleware/auth";

const router: IRouter = Router();

async function getAuthUserId(req: any): Promise<number | null> {
  const token = getBearerToken(req);
  if (token) {
    const su = await verifySupabaseToken(token);
    if (su) {
      const [u] = await db.select().from(usersTable).where(eq(usersTable.email, su.email));
      if (u) return u.id;
    }
  }
  if (req.session?.userId) return req.session.userId as number;
  return null;
}

async function requireAdmin(req: any, res: any): Promise<boolean> {
  const token = getBearerToken(req);
  if (token) {
    const su = await verifySupabaseToken(token);
    if (su) {
      const [u] = await db.select().from(usersTable).where(eq(usersTable.email, su.email));
      if (u?.role === "admin") return true;
    }
  }
  if (req.session?.userId) {
    const [u] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId));
    if (u?.role === "admin") return true;
  }
  res.status(403).json({ error: "Admin required" });
  return false;
}

async function ensureGamification(userId: number) {
  const [g] = await db.select().from(userGamificationTable).where(eq(userGamificationTable.userId, userId));
  if (!g) {
    await db.insert(userGamificationTable).values({ userId });
    const [fresh] = await db.select().from(userGamificationTable).where(eq(userGamificationTable.userId, userId));
    return fresh!;
  }
  return g;
}

router.get("/lessons/:lessonId/exercises", async (req, res): Promise<void> => {
  const lessonId = parseInt(req.params.lessonId);
  if (isNaN(lessonId)) { res.status(400).json({ error: "Invalid lessonId" }); return; }

  const userId = await getAuthUserId(req);

  const exercises = await db
    .select()
    .from(exercisesTable)
    .where(eq(exercisesTable.lessonId, lessonId))
    .orderBy(asc(exercisesTable.order));

  let attempts: any[] = [];
  if (userId) {
    attempts = await db
      .select()
      .from(exerciseAttemptsTable)
      .where(eq(exerciseAttemptsTable.userId, userId));
  }

  const attemptMap = new Map(attempts.map(a => [a.exerciseId, a]));

  res.json(
    exercises.map(e => ({
      id:            e.id,
      type:          e.type,
      question:      e.question,
      questionAr:    e.questionAr,
      questionSo:    e.questionSo,
      options:       e.options,
      explanation:   e.explanation,
      xpReward:      e.xpReward,
      order:         e.order,
      attempted:     attemptMap.has(e.id),
      wasCorrect:    attemptMap.get(e.id)?.isCorrect ?? null,
      userAnswer:    attemptMap.get(e.id)?.userAnswer ?? null,
    }))
  );
});

router.post("/exercises/:exerciseId/submit", async (req, res): Promise<void> => {
  const exerciseId = parseInt(req.params.exerciseId);
  if (isNaN(exerciseId)) { res.status(400).json({ error: "Invalid exerciseId" }); return; }

  const userId = await getAuthUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { answer } = req.body;
  if (typeof answer !== "string") { res.status(400).json({ error: "answer required" }); return; }

  const [exercise] = await db.select().from(exercisesTable).where(eq(exercisesTable.id, exerciseId));
  if (!exercise) { res.status(404).json({ error: "Exercise not found" }); return; }

  const [existing] = await db.select().from(exerciseAttemptsTable)
    .where(and(eq(exerciseAttemptsTable.userId, userId), eq(exerciseAttemptsTable.exerciseId, exerciseId)));

  const isCorrect = answer.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();
  const xpGained = isCorrect && !existing ? exercise.xpReward : 0;

  if (!existing) {
    await db.insert(exerciseAttemptsTable).values({ userId, exerciseId, isCorrect, userAnswer: answer });

    const g = await ensureGamification(userId);
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const lastActive = g.lastActiveDate ?? "";

    let newStreak = g.streak;
    if (lastActive === today) { /* unchanged */ }
    else if (lastActive === yesterday) newStreak = g.streak + 1;
    else newStreak = 1;

    const newXp = g.xp + xpGained;
    const newBadges = new Set(g.badges);
    if (newXp >= 1000 && !newBadges.has("xp-1000"))  newBadges.add("xp-1000");
    if (newXp >= 5000 && !newBadges.has("xp-5000"))  newBadges.add("xp-5000");
    if (newStreak >= 7 && !newBadges.has("7-day-streak")) newBadges.add("7-day-streak");

    await db.update(userGamificationTable)
      .set({
        xp: newXp,
        streak: newStreak,
        lastActiveDate: today,
        badges: [...newBadges],
        totalExercises: g.totalExercises + 1,
        correctAnswers: g.correctAnswers + (isCorrect ? 1 : 0),
        updatedAt: new Date(),
      })
      .where(eq(userGamificationTable.userId, userId));
  }

  res.json({
    isCorrect,
    correctAnswer: exercise.correctAnswer,
    explanation: exercise.explanation,
    xpGained,
    alreadyAttempted: !!existing,
  });
});

router.post("/admin/lessons/:lessonId/exercises", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const lessonId = parseInt(req.params.lessonId);
  if (isNaN(lessonId)) { res.status(400).json({ error: "Invalid lessonId" }); return; }

  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, lessonId));
  if (!lesson) { res.status(404).json({ error: "Lesson not found" }); return; }

  const { type, question, questionAr = "", questionSo = "", options, correctAnswer, explanation = "", xpReward = 10, order = 1 } = req.body;
  const VALID_TYPES = ["mcq", "true_false", "fill_blank", "word_match", "arrange"];
  if (!VALID_TYPES.includes(type)) { res.status(400).json({ error: "Invalid exercise type" }); return; }
  if (!question || !correctAnswer) { res.status(400).json({ error: "question and correctAnswer required" }); return; }

  const [exercise] = await db.insert(exercisesTable).values({
    lessonId, type, question, questionAr, questionSo,
    options: options ?? null, correctAnswer, explanation,
    xpReward: Math.min(100, Math.max(5, Number(xpReward))),
    order: Number(order),
  }).returning();

  res.json(exercise);
});

router.delete("/admin/exercises/:id", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  await db.delete(exercisesTable).where(eq(exercisesTable.id, id));
  res.json({ success: true });
});

router.patch("/admin/exercises/:id", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { question, questionAr, questionSo, options, correctAnswer, explanation, xpReward, order } = req.body;
  const update: Record<string, any> = {};
  if (question     !== undefined) update.question     = question;
  if (questionAr   !== undefined) update.questionAr   = questionAr;
  if (questionSo   !== undefined) update.questionSo   = questionSo;
  if (options      !== undefined) update.options      = options;
  if (correctAnswer !== undefined) update.correctAnswer = correctAnswer;
  if (explanation  !== undefined) update.explanation  = explanation;
  if (xpReward     !== undefined) update.xpReward     = Math.min(100, Math.max(5, Number(xpReward)));
  if (order        !== undefined) update.order        = Number(order);

  if (Object.keys(update).length === 0) { res.status(400).json({ error: "No fields to update" }); return; }

  const [updated] = await db.update(exercisesTable).set(update).where(eq(exercisesTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Exercise not found" }); return; }

  res.json(updated);
});

router.get("/admin/lessons/:lessonId/exercises", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const lessonId = parseInt(req.params.lessonId);
  if (isNaN(lessonId)) { res.status(400).json({ error: "Invalid lessonId" }); return; }

  const exercises = await db
    .select()
    .from(exercisesTable)
    .where(eq(exercisesTable.lessonId, lessonId))
    .orderBy(asc(exercisesTable.order));

  res.json(exercises);
});

export default router;
