import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, testimonialsTable, coursesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/testimonials", async (_req, res): Promise<void> => {
  const rows = await db.select().from(testimonialsTable).orderBy(testimonialsTable.id);

  const result = await Promise.all(
    rows.map(async (t) => {
      const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, t.courseId));
      return {
        id: t.id,
        name: t.name,
        text: t.text,
        rating: t.rating,
        courseId: t.courseId,
        courseName: course?.title ?? "Course",
        avatarUrl: t.avatarUrl ?? null,
      };
    })
  );

  res.json(result);
});

export default router;
