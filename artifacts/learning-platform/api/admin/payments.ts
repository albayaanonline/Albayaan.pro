import { getPool, setCors, ensureSchema } from "../_db";
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

  try {
    await ensureSchema(getPool());
    const { rows } = await getPool().query(`
      SELECT p.*, u.name as user_name, u.email as user_email, c.title as course_title
      FROM payments p
      JOIN users u ON u.id = p.user_id
      JOIN courses c ON c.id = p.course_id
      ORDER BY p.created_at DESC
    `);
    res.status(200).json(rows.map((p: any) => ({
      id: p.id, userId: p.user_id, courseId: p.course_id,
      status: p.status, whatsappNumber: p.whatsapp_number, notes: p.notes,
      accessCode: p.access_code, createdAt: p.created_at,
      userName: p.user_name, userEmail: p.user_email, courseTitle: p.course_title,
    })));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[admin/payments]", msg);
    res.status(500).json({ error: "Internal server error" });
  }
}
