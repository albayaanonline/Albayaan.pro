import { Router, type IRouter } from "express";
import { eq, count } from "drizzle-orm";
import { db, usersTable, paymentsTable, accessCodesTable, coursesTable, courseEnrollmentsTable } from "@workspace/db";
import { ConfirmPaymentParams, ConfirmPaymentBody, CreateCodeBody, DeactivateCodeParams } from "@workspace/api-zod";
import { randomBytes } from "crypto";

const router: IRouter = Router();

function requireAdmin(req: any, res: any): boolean {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

router.get("/admin/stats", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const [{ cnt: totalUsers }] = await db.select({ cnt: count(usersTable.id) }).from(usersTable);
  const [{ cnt: totalPayments }] = await db.select({ cnt: count(paymentsTable.id) }).from(paymentsTable);
  const [{ cnt: totalCodes }] = await db.select({ cnt: count(accessCodesTable.id) }).from(accessCodesTable);

  const pendingData = await db
    .select({ cnt: count(paymentsTable.id) })
    .from(paymentsTable)
    .where(eq(paymentsTable.status, "pending"));

  const confirmedData = await db
    .select({ cnt: count(paymentsTable.id) })
    .from(paymentsTable)
    .where(eq(paymentsTable.status, "confirmed"));

  const usedCodesData = await db
    .select({ cnt: count(accessCodesTable.id) })
    .from(accessCodesTable)
    .where(eq(accessCodesTable.isUsed, true));

  const confirmedCount = Number(confirmedData[0]?.cnt ?? 0);
  const courses = await db.select().from(coursesTable);
  const avgPrice = courses.length > 0 ? courses.reduce((sum, c) => sum + c.price, 0) / courses.length : 0;
  const revenueEstimate = confirmedCount * avgPrice;

  res.json({
    totalUsers: Number(totalUsers),
    totalPayments: Number(totalPayments),
    pendingPayments: Number(pendingData[0]?.cnt ?? 0),
    confirmedPayments: confirmedCount,
    totalCodes: Number(totalCodes),
    usedCodes: Number(usedCodesData[0]?.cnt ?? 0),
    revenueEstimate,
  });
});

router.get("/admin/users", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const users = await db.select().from(usersTable).orderBy(usersTable.createdAt);
  const enrollmentCounts = await db
    .select({ userId: courseEnrollmentsTable.userId, cnt: count(courseEnrollmentsTable.id) })
    .from(courseEnrollmentsTable)
    .groupBy(courseEnrollmentsTable.userId);

  const countMap = new Map(enrollmentCounts.map((r) => [r.userId, Number(r.cnt)]));

  res.json(
    users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      enrolledCourses: countMap.get(u.id) ?? 0,
      createdAt: u.createdAt.toISOString(),
    }))
  );
});

router.get("/admin/payments", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const payments = await db.select().from(paymentsTable).orderBy(paymentsTable.createdAt);

  const result = await Promise.all(
    payments.map(async (p) => {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, p.userId));
      const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, p.courseId));
      return {
        id: p.id,
        userId: p.userId,
        userEmail: user?.email ?? "",
        userName: user?.name ?? "",
        courseId: p.courseId,
        courseName: course?.title ?? "",
        status: p.status,
        whatsappNumber: p.whatsappNumber,
        notes: p.notes ?? null,
        accessCode: p.accessCode ?? null,
        createdAt: p.createdAt.toISOString(),
      };
    })
  );

  res.json(result);
});

router.post("/admin/payments/:paymentId/confirm", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const params = ConfirmPaymentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = ConfirmPaymentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [payment] = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.id, params.data.paymentId));

  if (!payment) {
    res.status(404).json({ error: "Payment not found" });
    return;
  }

  let generatedCode: string | null = null;
  if (body.data.generateCode) {
    const raw = randomBytes(4).toString("hex").toUpperCase();
    generatedCode = `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;

    await db.insert(accessCodesTable).values({
      code: generatedCode,
      courseId: payment.courseId,
      isActive: true,
      isUsed: false,
    });
  }

  const [updated] = await db
    .update(paymentsTable)
    .set({ status: "confirmed", accessCode: generatedCode })
    .where(eq(paymentsTable.id, params.data.paymentId))
    .returning();

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, updated.userId));
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, updated.courseId));

  res.json({
    id: updated.id,
    userId: updated.userId,
    userEmail: user?.email ?? "",
    userName: user?.name ?? "",
    courseId: updated.courseId,
    courseName: course?.title ?? "",
    status: updated.status,
    whatsappNumber: updated.whatsappNumber,
    notes: updated.notes ?? null,
    accessCode: updated.accessCode ?? null,
    createdAt: updated.createdAt.toISOString(),
  });
});

router.get("/admin/codes", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const codes = await db.select().from(accessCodesTable).orderBy(accessCodesTable.createdAt);

  const result = await Promise.all(
    codes.map(async (c) => {
      const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, c.courseId));
      let usedByEmail: string | null = null;
      if (c.usedByUserId) {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, c.usedByUserId));
        usedByEmail = user?.email ?? null;
      }
      return {
        id: c.id,
        code: c.code,
        courseId: c.courseId,
        courseName: course?.title ?? "",
        isActive: c.isActive,
        isUsed: c.isUsed,
        usedByUserId: c.usedByUserId ?? null,
        usedByEmail,
        usedAt: c.usedAt?.toISOString() ?? null,
        createdAt: c.createdAt.toISOString(),
      };
    })
  );

  res.json(result);
});

router.post("/admin/codes", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const body = CreateCodeBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, body.data.courseId));
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  const raw = randomBytes(4).toString("hex").toUpperCase();
  const code = `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;

  const [created] = await db
    .insert(accessCodesTable)
    .values({ code, courseId: body.data.courseId, isActive: true, isUsed: false })
    .returning();

  res.status(201).json({
    id: created.id,
    code: created.code,
    courseId: created.courseId,
    courseName: course.title,
    isActive: created.isActive,
    isUsed: created.isUsed,
    usedByUserId: created.usedByUserId ?? null,
    usedByEmail: null,
    usedAt: null,
    createdAt: created.createdAt.toISOString(),
  });
});

router.patch("/admin/codes/:codeId/deactivate", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const params = DeactivateCodeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [updated] = await db
    .update(accessCodesTable)
    .set({ isActive: false })
    .where(eq(accessCodesTable.id, params.data.codeId))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Code not found" });
    return;
  }

  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, updated.courseId));

  res.json({
    id: updated.id,
    code: updated.code,
    courseId: updated.courseId,
    courseName: course?.title ?? "",
    isActive: updated.isActive,
    isUsed: updated.isUsed,
    usedByUserId: updated.usedByUserId ?? null,
    usedByEmail: null,
    usedAt: updated.usedAt?.toISOString() ?? null,
    createdAt: updated.createdAt.toISOString(),
  });
});

export default router;
