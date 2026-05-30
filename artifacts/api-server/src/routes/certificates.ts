import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, certificatesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/certificates/:certId", async (req, res): Promise<void> => {
  const { certId } = req.params;
  if (!certId) { res.status(400).json({ error: "certId required" }); return; }

  const [cert] = await db.select().from(certificatesTable).where(eq(certificatesTable.certId, certId));
  if (!cert) { res.status(404).json({ error: "Certificate not found" }); return; }

  res.json(cert);
});

router.post("/certificates", async (req, res): Promise<void> => {
  const { certId, userId, courseId, studentName, courseName } = req.body;

  if (!certId || !userId || !courseId || !studentName || !courseName) {
    res.status(400).json({ error: "certId, userId, courseId, studentName, courseName are required" });
    return;
  }

  const [existing] = await db.select().from(certificatesTable).where(eq(certificatesTable.certId, certId));
  if (existing) { res.json(existing); return; }

  const [created] = await db
    .insert(certificatesTable)
    .values({ certId, userId: Number(userId), courseId: Number(courseId), studentName, courseName })
    .returning();

  res.status(201).json(created);
});

router.get("/users/:userId/certificates", async (req, res): Promise<void> => {
  const userId = Number(req.params.userId);
  if (isNaN(userId)) { res.status(400).json({ error: "Invalid userId" }); return; }

  const certs = await db.select().from(certificatesTable).where(eq(certificatesTable.userId, userId));
  res.json(certs);
});

export default router;
