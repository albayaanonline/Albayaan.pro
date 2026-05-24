import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, accessCodesTable, courseEnrollmentsTable, coursesTable } from "@workspace/db";
import { VerifyCodeBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/codes/verify", async (req, res): Promise<void> => {
  const userId: number | undefined = (req as any).session?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const body = VerifyCodeBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [code] = await db
    .select()
    .from(accessCodesTable)
    .where(eq(accessCodesTable.code, body.data.code));

  if (!code) {
    res.status(400).json({ error: "Invalid access code" });
    return;
  }

  if (!code.isActive) {
    res.status(400).json({ error: "This code has been deactivated" });
    return;
  }

  if (code.isUsed) {
    res.status(400).json({ error: "This code has already been used" });
    return;
  }

  // Mark code as used
  await db
    .update(accessCodesTable)
    .set({ isUsed: true, usedByUserId: userId, usedAt: new Date() })
    .where(eq(accessCodesTable.id, code.id));

  // Enroll user in course
  const [existing] = await db
    .select()
    .from(courseEnrollmentsTable)
    .where(
      and(
        eq(courseEnrollmentsTable.userId, userId),
        eq(courseEnrollmentsTable.courseId, code.courseId)
      )
    );

  if (!existing) {
    await db.insert(courseEnrollmentsTable).values({ userId, courseId: code.courseId });
  }

  const [course] = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.id, code.courseId));

  res.json({
    success: true,
    courseId: code.courseId,
    courseName: course?.title ?? "Course",
  });
});

export default router;
