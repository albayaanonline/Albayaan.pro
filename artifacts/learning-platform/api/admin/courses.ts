import { getPool, setCors, ensureSchema, seedIfEmpty } from "../_db";
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

let initialized = false;
async function init() {
  if (initialized) return;
  const p = getPool(); await ensureSchema(p); await seedIfEmpty(p); initialized = true;
}

export default async function handler(req: any, res: any): Promise<void> {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  const auth = req.headers.authorization as string | undefined;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || !verifyAdmin(token)) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    await init();
    const p = getPool();

    if (req.method === "GET") {
      const { rows } = await p.query(`
        SELECT c.*, count(l.id)::int as lesson_count
        FROM courses c LEFT JOIN lessons l ON l.course_id = c.id
        GROUP BY c.id ORDER BY c.id
      `);
      res.status(200).json(rows.map((c: any) => ({
        id: c.id, slug: c.slug, title: c.title, titleAr: c.title_ar, titleSo: c.title_so,
        description: c.description, descriptionAr: c.description_ar, descriptionSo: c.description_so,
        language: c.language, level: c.level, price: Number(c.price), duration: c.duration,
        thumbnailUrl: c.thumbnail_url, enrolledCount: c.enrolled_count,
        isPublished: c.is_published, lessonCount: c.lesson_count,
      })));
      return;
    }

    if (req.method === "POST") {
      const b = req.body as Record<string, any>;
      const slug = b.slug || b.title?.toLowerCase().replace(/\s+/g, "-") || `course-${Date.now()}`;
      const { rows } = await p.query(
        `INSERT INTO courses (slug, title, title_ar, title_so, description, description_ar, description_so, language, level, price, duration, thumbnail_url, is_published)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
        [slug, b.title||"", b.titleAr||"", b.titleSo||"", b.description||"", b.descriptionAr||"", b.descriptionSo||"",
         b.language||"english", b.level||"beginner", Number(b.price)||0, b.duration||"0h", b.thumbnailUrl||null, false]
      );
      res.status(201).json(rows[0]); return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[admin/courses]", msg);
    res.status(500).json({ error: "Internal server error" });
  }
}
