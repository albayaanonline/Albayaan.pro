import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, paymentsTable, coursesTable, usersTable } from "@workspace/db";
import { SubmitPaymentBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/payments", async (req, res): Promise<void> => {
  const userId: number | undefined = (req as any).session?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const body = SubmitPaymentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, body.data.courseId));
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

  const [payment] = await db
    .insert(paymentsTable)
    .values({
      userId,
      courseId: body.data.courseId,
      whatsappNumber: body.data.whatsappNumber,
      notes: body.data.notes ?? null,
      status: "pending",
    })
    .returning();

  res.status(201).json({
    id: payment.id,
    userId: payment.userId,
    userEmail: user?.email ?? "",
    userName: user?.name ?? "",
    courseId: payment.courseId,
    courseName: course.title,
    status: payment.status,
    whatsappNumber: payment.whatsappNumber,
    notes: payment.notes ?? null,
    accessCode: payment.accessCode ?? null,
    createdAt: payment.createdAt.toISOString(),
  });
});

export default router;
