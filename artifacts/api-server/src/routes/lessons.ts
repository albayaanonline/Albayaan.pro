import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, lessonsTable, quizzesTable, quizQuestionsTable } from "@workspace/db";
import { GetLessonParams, GetLessonQuizParams, SubmitQuizParams, SubmitQuizBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/lessons/:lessonId", async (req, res): Promise<void> => {
  const params = GetLessonParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, params.data.lessonId));
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  res.json({
    id: lesson.id,
    courseId: lesson.courseId,
    title: lesson.title,
    titleAr: lesson.titleAr,
    titleSo: lesson.titleSo,
    order: lesson.order,
    duration: lesson.duration,
    isLocked: lesson.isLocked,
    hasQuiz: lesson.hasQuiz,
    content: lesson.content,
    contentAr: lesson.contentAr,
    contentSo: lesson.contentSo,
    videoUrl: lesson.videoUrl ?? null,
  });
});

router.get("/lessons/:lessonId/quiz", async (req, res): Promise<void> => {
  const params = GetLessonQuizParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [quiz] = await db.select().from(quizzesTable).where(eq(quizzesTable.lessonId, params.data.lessonId));
  if (!quiz) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }

  const questions = await db
    .select()
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.quizId, quiz.id))
    .orderBy(quizQuestionsTable.order);

  res.json({
    id: quiz.id,
    lessonId: quiz.lessonId,
    questions: questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
    })),
  });
});

router.post("/lessons/:lessonId/quiz/submit", async (req, res): Promise<void> => {
  const params = SubmitQuizParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = SubmitQuizBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [quiz] = await db.select().from(quizzesTable).where(eq(quizzesTable.lessonId, params.data.lessonId));
  if (!quiz) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }

  const questions = await db
    .select()
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.quizId, quiz.id));

  let correct = 0;
  for (const answer of body.data.answers) {
    const q = questions.find((q) => q.id === answer.questionId);
    if (q && q.correctAnswer === answer.answer) {
      correct++;
    }
  }

  const total = questions.length;
  const passed = total > 0 && correct / total >= 0.6;

  res.json({ score: correct, total, passed });
});

export default router;
