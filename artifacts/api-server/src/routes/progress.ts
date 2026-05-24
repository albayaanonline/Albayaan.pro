import { Router, type IRouter } from "express";
import { eq, and, count } from "drizzle-orm";
import { db, lessonProgressTable, courseEnrollmentsTable, coursesTable, lessonsTable } from "@workspace/db";
import { MarkLessonCompleteBody, GetCertificateParams } from "@workspace/api-zod";

const router: IRouter = Router();

function requireAuth(req: any, res: any): number | null {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return req.session.userId as number;
}

router.get("/progress", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const enrollments = await db
    .select()
    .from(courseEnrollmentsTable)
    .where(eq(courseEnrollmentsTable.userId, userId));

  const result = await Promise.all(
    enrollments.map(async (enrollment) => {
      const [totalRow] = await db
        .select({ cnt: count(lessonsTable.id) })
        .from(lessonsTable)
        .where(eq(lessonsTable.courseId, enrollment.courseId));

      const [completedRow] = await db
        .select({ cnt: count(lessonProgressTable.id) })
        .from(lessonProgressTable)
        .where(
          and(
            eq(lessonProgressTable.userId, userId),
            eq(lessonProgressTable.courseId, enrollment.courseId)
          )
        );

      const total = Number(totalRow?.cnt ?? 0);
      const completed = Number(completedRow?.cnt ?? 0);
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        courseId: enrollment.courseId,
        userId: enrollment.userId,
        completedLessons: completed,
        totalLessons: total,
        percentComplete: percent,
        isCompleted: enrollment.isCompleted,
        completedAt: enrollment.completedAt?.toISOString() ?? null,
      };
    })
  );

  res.json(result);
});

router.post("/progress/complete", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const body = MarkLessonCompleteBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [lesson] = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.id, body.data.lessonId));

  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  const courseId = lesson.courseId;

  // Upsert enrollment
  const [enrollment] = await db
    .select()
    .from(courseEnrollmentsTable)
    .where(
      and(
        eq(courseEnrollmentsTable.userId, userId),
        eq(courseEnrollmentsTable.courseId, courseId)
      )
    );

  if (!enrollment) {
    await db.insert(courseEnrollmentsTable).values({ userId, courseId });
  }

  // Upsert progress
  const [existing] = await db
    .select()
    .from(lessonProgressTable)
    .where(
      and(
        eq(lessonProgressTable.userId, userId),
        eq(lessonProgressTable.lessonId, body.data.lessonId)
      )
    );

  if (!existing) {
    await db.insert(lessonProgressTable).values({
      userId,
      lessonId: body.data.lessonId,
      courseId,
    });
  }

  // Check if course is now complete
  const [totalRow] = await db
    .select({ cnt: count(lessonsTable.id) })
    .from(lessonsTable)
    .where(eq(lessonsTable.courseId, courseId));

  const [completedRow] = await db
    .select({ cnt: count(lessonProgressTable.id) })
    .from(lessonProgressTable)
    .where(
      and(
        eq(lessonProgressTable.userId, userId),
        eq(lessonProgressTable.courseId, courseId)
      )
    );

  const total = Number(totalRow?.cnt ?? 0);
  const completed = Number(completedRow?.cnt ?? 0);
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isCompleted = total > 0 && completed >= total;

  if (isCompleted) {
    await db
      .update(courseEnrollmentsTable)
      .set({ isCompleted: true, completedAt: new Date() })
      .where(
        and(
          eq(courseEnrollmentsTable.userId, userId),
          eq(courseEnrollmentsTable.courseId, courseId)
        )
      );
  }

  const [updatedEnrollment] = await db
    .select()
    .from(courseEnrollmentsTable)
    .where(
      and(
        eq(courseEnrollmentsTable.userId, userId),
        eq(courseEnrollmentsTable.courseId, courseId)
      )
    );

  res.json({
    courseId,
    userId,
    completedLessons: completed,
    totalLessons: total,
    percentComplete: percent,
    isCompleted: updatedEnrollment?.isCompleted ?? false,
    completedAt: updatedEnrollment?.completedAt?.toISOString() ?? null,
  });
});

router.get("/progress/certificate/:courseId", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const params = GetCertificateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [enrollment] = await db
    .select()
    .from(courseEnrollmentsTable)
    .where(
      and(
        eq(courseEnrollmentsTable.userId, userId),
        eq(courseEnrollmentsTable.courseId, params.data.courseId)
      )
    );

  if (!enrollment?.isCompleted) {
    res.status(403).json({ error: "Course not completed yet" });
    return;
  }

  const [course] = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.id, params.data.courseId));

  const { usersTable } = await import("@workspace/db");
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  res.json({
    userId,
    userName: user?.name ?? "Student",
    courseId: params.data.courseId,
    courseName: course?.title ?? "Course",
    completedAt: enrollment.completedAt?.toISOString() ?? new Date().toISOString(),
  });
});

export default router;
