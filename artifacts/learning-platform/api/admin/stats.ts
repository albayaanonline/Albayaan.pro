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
    const role = parts.slice(1, -1).join(":");
    return role === "admin";
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
    const p = getPool();

    const [usersR, coursesR, paymentsR, codesR] = await Promise.all([
      p.query(`SELECT count(*)::int as n FROM users WHERE role = 'user'`),
      p.query(`SELECT count(*)::int as n FROM courses`),
      p.query(`SELECT count(*)::int as pending FROM payments WHERE status = 'pending'`),
      p.query(`SELECT count(*)::int as total, count(*) FILTER (WHERE is_used) ::int as used FROM access_codes`),
    ]);

    res.status(200).json({
      totalStudents: usersR.rows[0].n,
      totalCourses: coursesR.rows[0].n,
      pendingPayments: paymentsR.rows[0].pending,
      totalCodes: codesR.rows[0].total,
      usedCodes: codesR.rows[0].used,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[admin/stats]", msg);
    res.status(500).json({ error: "Internal server error" });
  }
}
