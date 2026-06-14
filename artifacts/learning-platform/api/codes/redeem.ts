import { getPool, setCors, ensureSchema } from "../_db";
import { createHmac } from "crypto";

function getSecret(): string {
  return process.env.SESSION_SECRET ?? "albayaan-secret-fallback";
}

function verifyToken(token: string): { userId: number; role: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon === -1) return null;
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);
    const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");
    if (sig !== expected) return null;
    const parts = payload.split(":");
    if (parts.length < 3) return null;
    const expiresStr = parts[parts.length - 1];
    const role = parts.slice(1, -1).join(":");
    if (Date.now() > parseInt(expiresStr, 10)) return null;
    const userId = parseInt(parts[0], 10);
    if (isNaN(userId)) return null;
    return { userId, role };
  } catch { return null; }
}

export default async function handler(req: any, res: any): Promise<void> {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  const auth = req.headers.authorization as string | undefined;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  const claims = token ? verifyToken(token) : null;
  if (!claims) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { code } = (req.body as Record<string, string>) ?? {};
  if (!code) { res.status(400).json({ error: "Code is required" }); return; }

  try {
    await ensureSchema(getPool());
    const p = getPool();

    const { rows } = await p.query(
      `SELECT id, course_id, is_active, is_used FROM access_codes WHERE code = $1 LIMIT 1`,
      [String(code).trim().toUpperCase()]
    );
    const ac = rows[0];
    if (!ac) { res.status(404).json({ error: "Invalid access code" }); return; }
    if (!ac.is_active) { res.status(400).json({ error: "This code has been deactivated" }); return; }
    if (ac.is_used) { res.status(400).json({ error: "This code has already been used" }); return; }

    // Check already enrolled
    const { rows: enrolled } = await p.query(
      `SELECT id FROM course_enrollments WHERE user_id = $1 AND course_id = $2 LIMIT 1`,
      [claims.userId, ac.course_id]
    );
    if (enrolled.length > 0) {
      res.status(400).json({ error: "You are already enrolled in this course" }); return;
    }

    // Enroll
    await p.query(
      `INSERT INTO course_enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [claims.userId, ac.course_id]
    );
    await p.query(
      `UPDATE access_codes SET is_used = true, used_by_user_id = $1, used_at = now() WHERE id = $2`,
      [claims.userId, ac.id]
    );
    await p.query(
      `UPDATE courses SET enrolled_count = enrolled_count + 1 WHERE id = $1`,
      [ac.course_id]
    );

    res.status(200).json({ ok: true, courseId: ac.course_id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[codes/redeem]", msg);
    res.status(500).json({ error: "Internal server error" });
  }
}
