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
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[admin/courses/[courseId]]", msg);
    res.status(500).json({ error: "Internal server error" });
  }
}
