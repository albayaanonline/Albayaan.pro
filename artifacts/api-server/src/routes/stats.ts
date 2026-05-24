import { Router, type IRouter } from "express";
import { eq, count } from "drizzle-orm";
import { db, coursesTable, usersTable, lessonsTable, courseEnrollmentsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/stats/summary", async (_req, res): Promise<void> => {
  const [{ cnt: totalStudents }] = await db.select({ cnt: count(usersTable.id) }).from(usersTable);
  const [{ cnt: totalCourses }] = await db.select({ cnt: count(coursesTable.id) }).from(coursesTable);
  const [{ cnt: totalLessons }] = await db.select({ cnt: count(lessonsTable.id) }).from(lessonsTable);
  const [{ cnt: totalEnrollments }] = await db.select({ cnt: count(courseEnrollmentsTable.id) }).from(courseEnrollmentsTable);

  const completedEnrollmentsData = await db
    .select({ cnt: count(courseEnrollmentsTable.id) })
    .from(courseEnrollmentsTable)
    .where(eq(courseEnrollmentsTable.isCompleted, true));

  const completed = Number(completedEnrollmentsData[0]?.cnt ?? 0);
  const total = Number(totalEnrollments);
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  res.json({
    totalStudents: Number(totalStudents),
    totalCourses: Number(totalCourses),
    totalLessons: Number(totalLessons),
    completionRate,
  });
});

export default router;
