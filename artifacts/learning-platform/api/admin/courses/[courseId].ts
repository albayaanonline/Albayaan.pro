import { getPool, setCors, ensureSchema } from "../../_db";
import { createHmac } from "crypto";

function getSecret() { return process.env.SESSION_SECRET ?? "albayaan-secret-fallback"; }
function verifyAdmin(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon === -1) return false;
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);
    const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");
    if (sig !== expected) return false;
    const parts = payload.split(":");
    if (parts.length < 3) return false;
    if (Date.now() > parseInt(parts[parts.length - 1], 10)) return false;
    return parts.slice(1, -1).join(":") === "admin";
  } catch { return false; }
}

async function handlePublish(req: any, res: any, courseId: number, p: any): Promise<void> {
  if (req.method !== "PATCH") { res.status(405).json({ error: "Method not allowed" }); return; }
  const b = req.body as Record<string, any>;
  const isPublished = Boolean(b.isPublished);
  const { rows } = await p.query(
    `UPDATE courses SET is_published = $1 WHERE id = $2 RETURNING id, is_published`,
    [isPublished, courseId]
  );
  if (!rows[0]) { res.status(404).json({ error: "Course not found" }); return; }
  res.status(200).json(rows[0]);
}

async function handleLessons(req: any, res: any, courseId: number, p: any): Promise<void> {
  if (req.method === "GET") {
    const { rows } = await p.query(
      `SELECT * FROM lessons WHERE course_id = $1 ORDER BY "order"`, [courseId]
    );
    res.status(200).json(rows.map((l: any) => ({
      id: l.id, courseId: l.course_id, title: l.title, titleAr: l.title_ar, titleSo: l.title_so,
      order: l.order, duration: l.duration, isLocked: l.is_locked, hasQuiz: l.has_quiz,
      content: l.content, contentAr: l.content_ar, videoUrl: l.video_url, pdfUrl: l.pdf_url,
    })));
    return;
  }
  if (req.method === "POST") {
    const b = req.body as Record<string, any>;
    const { rows: countR } = await p.query(`SELECT count(*)::int as n FROM lessons WHERE course_id = $1`, [courseId]);
    const order = b.order ?? (countR[0].n + 1);
    const { rows } = await p.query(
      `INSERT INTO lessons (course_id, title, title_ar, title_so, "order", duration, is_locked, has_quiz, content, content_ar, content_so, video_url, pdf_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [courseId, b.title||"New Lesson", b.titleAr||"", b.titleSo||"", order,
       b.duration||"30m", b.isLocked !== false, b.hasQuiz||false,
       b.content||"", b.contentAr||"", b.contentSo||"",
       b.videoUrl||null, b.pdfUrl||null]
    );
    res.status(201).json(rows[0]); return;
  }
  res.status(405).json({ error: "Method not allowed" });
}

export default async function handler(req: any, res: any): Promise<void> {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  const auth = req.headers.authorization as string | undefined;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || !verifyAdmin(token)) { res.status(401).json({ error: "Unauthorized" }); return; }

  const courseId = parseInt(String(req.query.courseId), 10);
  if (isNaN(courseId)) { res.status(400).json({ error: "Invalid courseId" }); return; }

  try {
    await ensureSchema(getPool());
    const p = getPool();
    const sub = req.query.sub as string | undefined;

    if (sub === "publish") return handlePublish(req, res, courseId, p);
    if (sub === "lessons") return handleLessons(req, res, courseId, p);

    if (req.method === "GET") {
      const { rows } = await p.query(`SELECT * FROM courses WHERE id = $1 LIMIT 1`, [courseId]);
      if (!rows[0]) { res.status(404).json({ error: "Course not found" }); return; }
      res.status(200).json(rows[0]); return;
    }
    if (req.method === "PATCH" || req.method === "PUT") {
      const b = req.body as Record<string, any>;
      await p.query(
        `UPDATE courses SET title=$1, title_ar=$2, title_so=$3, description=$4, description_ar=$5, description_so=$6,
         language=$7, level=$8, price=$9, duration=$10, thumbnail_url=$11 WHERE id=$12`,
        [b.title, b.titleAr||"", b.titleSo||"", b.description||"", b.descriptionAr||"", b.descriptionSo||"",
         b.language||"english", b.level||"beginner", Number(b.price)||0, b.duration||"0h", b.thumbnailUrl||null, courseId]
      );
      const { rows } = await p.query(`SELECT * FROM courses WHERE id = $1`, [courseId]);
      res.status(200).json(rows[0]); return;
    }
    if (req.method === "DELETE") {
      await p.query(`DELETE FROM courses WHERE id = $1`, [courseId]);
      res.status(200).json({ ok: true }); return;
    }
    res.status(405).json({ error: "Method not allowed" });
  } catch (err: unknown) {
    console.error("[admin/courses/[courseId]]", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "Internal server error" });
  }
}
