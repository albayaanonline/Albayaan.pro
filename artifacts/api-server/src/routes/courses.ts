import { Router, type IRouter } from "express";
import { eq, count } from "drizzle-orm";
import { db, coursesTable, lessonsTable } from "@workspace/db";
import { GetCourseParams, GetCourseLessonsParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/courses", async (_req, res): Promise<void> => {
  const courses = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.isPublished, true))
    .orderBy(coursesTable.id);

  const lessonsCountData = await db
    .select({ courseId: lessonsTable.courseId, cnt: count(lessonsTable.id) })
    .from(lessonsTable)
    .groupBy(lessonsTable.courseId);

  const countMap = new Map(lessonsCountData.map((r) => [r.courseId, Number(r.cnt)]));

  res.json(
    courses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      titleAr: c.titleAr,
      titleSo: c.titleSo,
      description: c.description,
      descriptionAr: c.descriptionAr,
      descriptionSo: c.descriptionSo,
      language: c.language,
      level: c.level,
      price: c.price,
      lessonCount: countMap.get(c.id) ?? 0,
      duration: c.duration,
      thumbnailUrl: c.thumbnailUrl ?? null,
      enrolledCount: c.enrolledCount,
      isPublished: c.isPublished,
    }))
  );
});

router.get("/courses/:courseId", async (req, res): Promise<void> => {
  const params = GetCourseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, params.data.courseId));
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  const lessons = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.courseId, course.id))
    .orderBy(lessonsTable.order);

  res.json({
    id: course.id,
    slug: course.slug,
    title: course.title,
    titleAr: course.titleAr,
    titleSo: course.titleSo,
    description: course.description,
    descriptionAr: course.descriptionAr,
    descriptionSo: course.descriptionSo,
    language: course.language,
    level: course.level,
    price: course.price,
    lessonCount: lessons.length,
    duration: course.duration,
    thumbnailUrl: course.thumbnailUrl ?? null,
    enrolledCount: course.enrolledCount,
    isPublished: course.isPublished,
    lessons: lessons.map((l) => ({
      id: l.id,
      courseId: l.courseId,
      title: l.title,
      titleAr: l.titleAr,
      titleSo: l.titleSo,
      order: l.order,
      duration: l.duration,
      isLocked: l.isLocked,
      hasQuiz: l.hasQuiz,
    })),
  });
});

router.get("/courses/:courseId/lessons", async (req, res): Promise<void> => {
  const params = GetCourseLessonsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const lessons = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.courseId, params.data.courseId))
    .orderBy(lessonsTable.order);

  res.json(
    lessons.map((l) => ({
      id: l.id,
      courseId: l.courseId,
      title: l.title,
      titleAr: l.titleAr,
      titleSo: l.titleSo,
      order: l.order,
      duration: l.duration,
      isLocked: l.isLocked,
      hasQuiz: l.hasQuiz,
    }))
  );
});

export default router;
