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

  const { courseId, whatsappNumber, notes } = (req.body as Record<string, any>) ?? {};
  if (!courseId || !whatsappNumber) {
    res.status(400).json({ error: "courseId and whatsappNumber are required" }); return;
  }

  try {
    await ensureSchema(getPool());
    const { rows } = await getPool().query(
      `INSERT INTO payments (user_id, course_id, whatsapp_number, notes, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING id`,
      [claims.userId, Number(courseId), String(whatsappNumber), notes ?? null]
    );
    res.status(201).json({ ok: true, paymentId: rows[0].id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[payments/submit]", msg);
    res.status(500).json({ error: "Internal server error" });
  }
}
