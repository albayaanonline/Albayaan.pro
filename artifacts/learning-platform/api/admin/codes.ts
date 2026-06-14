import { getPool, setCors, ensureSchema } from "../_db";
import { createHmac } from "crypto";
import { randomBytes } from "crypto";

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

function generateCode(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

export default async function handler(req: any, res: any): Promise<void> {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  const auth = req.headers.authorization as string | undefined;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || !verifyAdmin(token)) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    await ensureSchema(getPool());
    const p = getPool();

    if (req.method === "GET") {
      const { rows } = await p.query(`
        SELECT ac.*, c.title as course_title, u.email as used_by_email
        FROM access_codes ac
        JOIN courses c ON c.id = ac.course_id
        LEFT JOIN users u ON u.id = ac.used_by_user_id
        ORDER BY ac.created_at DESC
      `);
      res.status(200).json(rows.map((c: any) => ({
        id: c.id, code: c.code, courseId: c.course_id, courseTitle: c.course_title,
        isActive: c.is_active, isUsed: c.is_used,
        usedByEmail: c.used_by_email, usedAt: c.used_at, createdAt: c.created_at,
      })));
      return;
    }

    if (req.method === "POST") {
      const b = req.body as Record<string, any>;
      const courseId = Number(b.courseId);
      if (!courseId) { res.status(400).json({ error: "courseId required" }); return; }
      const code = b.code || generateCode();
      const { rows } = await p.query(
        `INSERT INTO access_codes (code, course_id) VALUES ($1, $2) RETURNING *`,
        [String(code).toUpperCase(), courseId]
      );
      res.status(201).json({ id: rows[0].id, code: rows[0].code, courseId: rows[0].course_id }); return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[admin/codes]", msg);
    res.status(500).json({ error: "Internal server error" });
  }
}
