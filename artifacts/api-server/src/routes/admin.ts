import { Router, type IRouter } from "express";
import { eq, count, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
  db, usersTable, paymentsTable, accessCodesTable, coursesTable,
  courseEnrollmentsTable, lessonsTable, certificatesTable,
} from "@workspace/db";
import { ConfirmPaymentParams, ConfirmPaymentBody, CreateCodeBody, DeactivateCodeParams } from "@workspace/api-zod";
import { randomBytes } from "crypto";
import { verifySupabaseToken, getBearerToken } from "../middleware/auth";

const router: IRouter = Router();

async function requireAdmin(req: any, res: any): Promise<boolean> {
  const token = getBearerToken(req);
  if (token) {
    const supabaseUser = await verifySupabaseToken(token);
    if (supabaseUser) {
      const [dbUser] = await db.select().from(usersTable).where(eq(usersTable.email, supabaseUser.email));
      if (dbUser?.role === "admin") return true;
    }
  }

  if (!req.session?.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId));
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Forbidden: Admin access required" });
    return false;
  }
  return true;
}

router.get("/admin/stats", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const [{ cnt: totalUsers }]       = await db.select({ cnt: count(usersTable.id) }).from(usersTable);
  const [{ cnt: totalCourses }]     = await db.select({ cnt: count(coursesTable.id) }).from(coursesTable);
  const [{ cnt: totalLessons }]     = await db.select({ cnt: count(lessonsTable.id) }).from(lessonsTable);
  const [{ cnt: totalPayments }]    = await db.select({ cnt: count(paymentsTable.id) }).from(paymentsTable);
  const [{ cnt: totalCodes }]       = await db.select({ cnt: count(accessCodesTable.id) }).from(accessCodesTable);
  const [{ cnt: totalEnrollments }] = await db.select({ cnt: count(courseEnrollmentsTable.id) }).from(courseEnrollmentsTable);
  const [{ cnt: totalCertificates }] = await db.select({ cnt: count(certificatesTable.id) }).from(certificatesTable);

  const pendingData   = await db.select({ cnt: count(paymentsTable.id) }).from(paymentsTable).where(eq(paymentsTable.status, "pending"));
  const confirmedData = await db.select({ cnt: count(paymentsTable.id) }).from(paymentsTable).where(eq(paymentsTable.status, "confirmed"));
  const usedCodesData = await db.select({ cnt: count(accessCodesTable.id) }).from(accessCodesTable).where(eq(accessCodesTable.isUsed, true));
  const publishedCoursesData = await db.select({ cnt: count(coursesTable.id) }).from(coursesTable).where(eq(coursesTable.isPublished, true));

  const confirmedCount = Number(confirmedData[0]?.cnt ?? 0);
  const courses = await db.select().from(coursesTable);
  const avgPrice = courses.length > 0 ? courses.reduce((sum, c) => sum + c.price, 0) / courses.length : 0;
  const revenueEstimate = confirmedCount * avgPrice;

  res.json({
    totalUsers: Number(totalUsers),
    totalCourses: Number(totalCourses),
    totalLessons: Number(totalLessons),
    totalPayments: Number(totalPayments),
    pendingPayments: Number(pendingData[0]?.cnt ?? 0),
    confirmedPayments: confirmedCount,
    totalCodes: Number(totalCodes),
    usedCodes: Number(usedCodesData[0]?.cnt ?? 0),
    totalEnrollments: Number(totalEnrollments),
    totalCertificates: Number(totalCertificates),
    publishedCourses: Number(publishedCoursesData[0]?.cnt ?? 0),
    revenueEstimate,
  });
});

router.get("/admin/users", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
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

// ── COURSES CRUD ──

router.get("/admin/courses", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const courses = await db.select().from(coursesTable).orderBy(desc(coursesTable.createdAt));
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
      duration: c.duration,
      thumbnailUrl: c.thumbnailUrl ?? null,
      enrolledCount: c.enrolledCount,
      isPublished: c.isPublished,
      lessonCount: countMap.get(c.id) ?? 0,
      createdAt: c.createdAt.toISOString(),
    }))
  );
});

router.post("/admin/courses", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const { title, titleAr, titleSo, description, descriptionAr, descriptionSo, language, level, price, duration, thumbnailUrl, isPublished } = req.body;

  if (!title || !language) {
    res.status(400).json({ error: "title and language are required" });
    return;
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();

  const [created] = await db.insert(coursesTable).values({
    slug,
    title,
    titleAr: titleAr || title,
    titleSo: titleSo || title,
    description: description || "",
    descriptionAr: descriptionAr || description || "",
    descriptionSo: descriptionSo || description || "",
    language,
    level: level || "beginner",
    price: Number(price) || 0,
    duration: duration || "8 weeks",
    thumbnailUrl: thumbnailUrl || null,
    enrolledCount: 0,
    isPublished: isPublished ?? false,
  }).returning();

  res.status(201).json({
    id: created.id,
    slug: created.slug,
    title: created.title,
    titleAr: created.titleAr,
    language: created.language,
    level: created.level,
    price: created.price,
    duration: created.duration,
    thumbnailUrl: created.thumbnailUrl,
    enrolledCount: created.enrolledCount,
    isPublished: created.isPublished,
    lessonCount: 0,
    createdAt: created.createdAt.toISOString(),
  });
});

router.put("/admin/courses/:courseId", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const courseId = Number(req.params.courseId);
  if (isNaN(courseId)) {
    res.status(400).json({ error: "Invalid course ID" });
    return;
  }

  const { title, titleAr, titleSo, description, descriptionAr, descriptionSo, language, level, price, duration, thumbnailUrl, isPublished } = req.body;

  const updateData: Record<string, any> = {};
  if (title !== undefined) updateData.title = title;
  if (titleAr !== undefined) updateData.titleAr = titleAr;
  if (titleSo !== undefined) updateData.titleSo = titleSo;
  if (description !== undefined) updateData.description = description;
  if (descriptionAr !== undefined) updateData.descriptionAr = descriptionAr;
  if (descriptionSo !== undefined) updateData.descriptionSo = descriptionSo;
  if (language !== undefined) updateData.language = language;
  if (level !== undefined) updateData.level = level;
  if (price !== undefined) updateData.price = Number(price);
  if (duration !== undefined) updateData.duration = duration;
  if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl || null;
  if (isPublished !== undefined) updateData.isPublished = isPublished;

  const [updated] = await db.update(coursesTable).set(updateData).where(eq(coursesTable.id, courseId)).returning();

  if (!updated) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  res.json({
    id: updated.id,
    slug: updated.slug,
    title: updated.title,
    titleAr: updated.titleAr,
    language: updated.language,
    level: updated.level,
    price: updated.price,
    duration: updated.duration,
    thumbnailUrl: updated.thumbnailUrl,
    enrolledCount: updated.enrolledCount,
    isPublished: updated.isPublished,
    createdAt: updated.createdAt.toISOString(),
  });
});

router.patch("/admin/courses/:courseId/publish", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const courseId = Number(req.params.courseId);
  if (isNaN(courseId)) {
    res.status(400).json({ error: "Invalid course ID" });
    return;
  }

  const { isPublished } = req.body;
  if (typeof isPublished !== "boolean") {
    res.status(400).json({ error: "isPublished must be a boolean" });
    return;
  }

  const [updated] = await db
    .update(coursesTable)
    .set({ isPublished })
    .where(eq(coursesTable.id, courseId))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  res.json({ id: updated.id, isPublished: updated.isPublished, title: updated.title });
});

router.delete("/admin/courses/:courseId", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const courseId = Number(req.params.courseId);
  if (isNaN(courseId)) {
    res.status(400).json({ error: "Invalid course ID" });
    return;
  }

  await db.delete(lessonsTable).where(eq(lessonsTable.courseId, courseId));
  const [deleted] = await db.delete(coursesTable).where(eq(coursesTable.id, courseId)).returning();

  if (!deleted) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  res.json({ success: true, id: courseId });
});

// ── LESSONS CRUD ──

router.get("/admin/courses/:courseId/lessons", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const courseId = Number(req.params.courseId);
  const lessons = await db.select().from(lessonsTable).where(eq(lessonsTable.courseId, courseId)).orderBy(lessonsTable.order);

  res.json(lessons.map(l => ({
    id: l.id,
    courseId: l.courseId,
    title: l.title,
    titleAr: l.titleAr,
    titleSo: l.titleSo,
    order: l.order,
    duration: l.duration,
    isLocked: l.isLocked,
    hasQuiz: l.hasQuiz,
    content: l.content,
    contentAr: l.contentAr,
    contentSo: l.contentSo,
    videoUrl: l.videoUrl ?? null,
  })));
});

router.post("/admin/courses/:courseId/lessons", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const courseId = Number(req.params.courseId);
  const { title, titleAr, titleSo, content, contentAr, contentSo, duration, isLocked, hasQuiz, videoUrl } = req.body;

  if (!title) {
    res.status(400).json({ error: "title is required" });
    return;
  }

  const existing = await db.select().from(lessonsTable).where(eq(lessonsTable.courseId, courseId)).orderBy(lessonsTable.order);
  const nextOrder = existing.length > 0 ? Math.max(...existing.map(l => l.order)) + 1 : 1;

  const [created] = await db.insert(lessonsTable).values({
    courseId,
    title,
    titleAr: titleAr || title,
    titleSo: titleSo || title,
    content: content || "",
    contentAr: contentAr || content || "",
    contentSo: contentSo || content || "",
    order: nextOrder,
    duration: duration || "10 min",
    isLocked: isLocked ?? true,
    hasQuiz: hasQuiz ?? false,
    videoUrl: videoUrl || null,
  }).returning();

  res.status(201).json(created);
});

router.put("/admin/lessons/:lessonId", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const lessonId = Number(req.params.lessonId);
  const { title, titleAr, titleSo, content, contentAr, contentSo, duration, isLocked, hasQuiz, videoUrl } = req.body;

  const updateData: Record<string, any> = {};
  if (title !== undefined) updateData.title = title;
  if (titleAr !== undefined) updateData.titleAr = titleAr;
  if (titleSo !== undefined) updateData.titleSo = titleSo;
  if (content !== undefined) updateData.content = content;
  if (contentAr !== undefined) updateData.contentAr = contentAr;
  if (contentSo !== undefined) updateData.contentSo = contentSo;
  if (duration !== undefined) updateData.duration = duration;
  if (isLocked !== undefined) updateData.isLocked = isLocked;
  if (hasQuiz !== undefined) updateData.hasQuiz = hasQuiz;
  if (videoUrl !== undefined) updateData.videoUrl = videoUrl || null;

  const [updated] = await db.update(lessonsTable).set(updateData).where(eq(lessonsTable.id, lessonId)).returning();

  if (!updated) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  res.json(updated);
});

router.delete("/admin/lessons/:lessonId", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const lessonId = Number(req.params.lessonId);
  const [deleted] = await db.delete(lessonsTable).where(eq(lessonsTable.id, lessonId)).returning();

  if (!deleted) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  res.json({ success: true, id: lessonId });
});

// ── USER MANAGEMENT ──

router.delete("/admin/users/:userId", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const userId = Number(req.params.userId);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  if (req.session?.userId === userId) {
    res.status(400).json({ error: "Cannot delete your own account" });
    return;
  }

  const [deleted] = await db.delete(usersTable).where(eq(usersTable.id, userId)).returning();
  if (!deleted) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ success: true, id: userId });
});

router.patch("/admin/users/:userId/role", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const userId = Number(req.params.userId);
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    res.status(400).json({ error: "role must be 'user' or 'admin'" });
    return;
  }

  const [updated] = await db.update(usersTable).set({ role }).where(eq(usersTable.id, userId)).returning();

  if (!updated) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ id: updated.id, name: updated.name, email: updated.email, role: updated.role });
});

// ── PAYMENTS ──

router.get("/admin/payments", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const payments = await db.select().from(paymentsTable).orderBy(desc(paymentsTable.createdAt));

  const result = await Promise.all(
    payments.map(async (p) => {
      const [user]   = await db.select().from(usersTable).where(eq(usersTable.id, p.userId));
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
  if (!await requireAdmin(req, res)) return;

  const params = ConfirmPaymentParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const body = ConfirmPaymentBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.message }); return; }

  const [payment] = await db.select().from(paymentsTable).where(eq(paymentsTable.id, params.data.paymentId));
  if (!payment) { res.status(404).json({ error: "Payment not found" }); return; }

  let generatedCode: string | null = null;
  if (body.data.generateCode) {
    const raw = randomBytes(4).toString("hex").toUpperCase();
    generatedCode = `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
    await db.insert(accessCodesTable).values({ code: generatedCode, courseId: payment.courseId, isActive: true, isUsed: false });
  }

  const [updated] = await db.update(paymentsTable).set({ status: "confirmed", accessCode: generatedCode }).where(eq(paymentsTable.id, params.data.paymentId)).returning();
  const [user]   = await db.select().from(usersTable).where(eq(usersTable.id, updated.userId));
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

router.patch("/admin/payments/:paymentId/reject", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const paymentId = Number(req.params.paymentId);
  if (isNaN(paymentId)) {
    res.status(400).json({ error: "Invalid payment ID" });
    return;
  }

  const [payment] = await db.select().from(paymentsTable).where(eq(paymentsTable.id, paymentId));
  if (!payment) { res.status(404).json({ error: "Payment not found" }); return; }

  const [updated] = await db.update(paymentsTable).set({ status: "rejected" }).where(eq(paymentsTable.id, paymentId)).returning();
  const [user]   = await db.select().from(usersTable).where(eq(usersTable.id, updated.userId));
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

// ── ACCESS CODES ──

router.get("/admin/codes", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const codes = await db.select().from(accessCodesTable).orderBy(desc(accessCodesTable.createdAt));

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
  if (!await requireAdmin(req, res)) return;

  const body = CreateCodeBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.message }); return; }

  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, body.data.courseId));
  if (!course) { res.status(404).json({ error: "Course not found" }); return; }

  const raw = randomBytes(4).toString("hex").toUpperCase();
  const code = `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;

  const [created] = await db.insert(accessCodesTable).values({ code, courseId: body.data.courseId, isActive: true, isUsed: false }).returning();

  res.status(201).json({
    id: created.id,
    code: created.code,
    courseId: created.courseId,
    courseName: course.title,
    isActive: created.isActive,
    isUsed: created.isUsed,
    usedByUserId: null,
    usedByEmail: null,
    usedAt: null,
    createdAt: created.createdAt.toISOString(),
  });
});

router.patch("/admin/codes/:codeId/deactivate", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const params = DeactivateCodeParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const [updated] = await db.update(accessCodesTable).set({ isActive: false }).where(eq(accessCodesTable.id, params.data.codeId)).returning();
  if (!updated) { res.status(404).json({ error: "Code not found" }); return; }

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

// ── CERTIFICATES ──

router.get("/admin/certificates", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const certs = await db.select().from(certificatesTable).orderBy(desc(certificatesTable.issuedAt));
  res.json(certs.map(c => ({
    id: c.id,
    certId: c.certId,
    userId: c.userId,
    courseId: c.courseId,
    studentName: c.studentName,
    courseName: c.courseName,
    issuedAt: c.issuedAt.toISOString(),
  })));
});

router.post("/admin/certificates/issue", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const { userId, courseId, studentName, courseName } = req.body;

  if (!userId || !courseId || !studentName || !courseName) {
    res.status(400).json({ error: "userId, courseId, studentName, and courseName are required" });
    return;
  }

  const existing = await db.select().from(certificatesTable)
    .where(eq(certificatesTable.userId, Number(userId)))
    .then(rows => rows.find(r => r.courseId === Number(courseId)));

  if (existing) {
    res.status(409).json({ error: "Certificate already issued for this student and course", certId: existing.certId });
    return;
  }

  const hash = Buffer.from(`${userId}-${courseId}-${studentName}`).toString("base64").replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 8);
  const certId = `ALBAYAAN-${hash.slice(0, 4)}-${hash.slice(4, 8)}`;

  const [created] = await db.insert(certificatesTable).values({
    certId,
    userId: Number(userId),
    courseId: Number(courseId),
    studentName,
    courseName,
  }).returning();

  res.status(201).json({
    id: created.id,
    certId: created.certId,
    userId: created.userId,
    courseId: created.courseId,
    studentName: created.studentName,
    courseName: created.courseName,
    issuedAt: created.issuedAt.toISOString(),
  });
});

router.delete("/admin/certificates/:certId", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const { certId } = req.params;
  const [deleted] = await db.delete(certificatesTable).where(eq(certificatesTable.certId, certId)).returning();

  if (!deleted) {
    res.status(404).json({ error: "Certificate not found" });
    return;
  }

  res.json({ success: true, certId });
});

// ── ANALYTICS ──

router.get("/admin/analytics", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const totalUsers        = await db.select({ cnt: count(usersTable.id) }).from(usersTable);
  const totalCourses      = await db.select({ cnt: count(coursesTable.id) }).from(coursesTable);
  const totalLessons      = await db.select({ cnt: count(lessonsTable.id) }).from(lessonsTable);
  const totalEnrollments  = await db.select({ cnt: count(courseEnrollmentsTable.id) }).from(courseEnrollmentsTable);
  const confirmedPayments = await db.select({ cnt: count(paymentsTable.id) }).from(paymentsTable).where(eq(paymentsTable.status, "confirmed"));
  const totalCertificates = await db.select({ cnt: count(certificatesTable.id) }).from(certificatesTable);

  const courses     = await db.select().from(coursesTable).orderBy(desc(coursesTable.enrolledCount));
  const recentUsers = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt)).limit(10);

  res.json({
    totalUsers:        Number(totalUsers[0]?.cnt ?? 0),
    totalCourses:      Number(totalCourses[0]?.cnt ?? 0),
    totalLessons:      Number(totalLessons[0]?.cnt ?? 0),
    totalEnrollments:  Number(totalEnrollments[0]?.cnt ?? 0),
    confirmedPayments: Number(confirmedPayments[0]?.cnt ?? 0),
    totalCertificates: Number(totalCertificates[0]?.cnt ?? 0),
    topCourses: courses.slice(0, 5).map(c => ({
      id: c.id, title: c.title, enrolledCount: c.enrolledCount, price: c.price, isPublished: c.isPublished,
    })),
    recentUsers: recentUsers.map(u => ({
      id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt.toISOString(),
    })),
  });
});

router.post("/admin/change-password", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "currentPassword and newPassword are required" });
    return;
  }

  if (typeof newPassword !== "string" || newPassword.length < 8) {
    res.status(400).json({ error: "New password must be at least 8 characters" });
    return;
  }

  let userId: number | null = null;

  const token = getBearerToken(req);
  if (token) {
    const supabaseUser = await verifySupabaseToken(token);
    if (supabaseUser) {
      const [dbUser] = await db.select().from(usersTable).where(eq(usersTable.email, supabaseUser.email));
      if (dbUser?.role === "admin") userId = dbUser.id;
    }
  }
  if (!userId && req.session?.userId) {
    userId = req.session.userId as number;
  }

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (user.passwordHash === "supabase-auth") {
    res.status(400).json({ error: "This account uses Supabase authentication. Change your password in your Supabase account settings." });
    return;
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await db.update(usersTable).set({ passwordHash: newHash }).where(eq(usersTable.id, userId));

  res.json({ success: true, message: "Password updated successfully" });
});

export default router;
