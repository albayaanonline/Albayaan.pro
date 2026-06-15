import { getPool, setCors, ensureSchema } from "../_db";
import { createHmac, randomBytes } from "crypto";

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

async function handleStats(_req: any, res: any): Promise<void> {
  const p = getPool();
  const [usersR, coursesR, paymentsR, codesR] = await Promise.all([
    p.query(`SELECT count(*)::int as n FROM users WHERE role = 'user'`),
    p.query(`SELECT count(*)::int as n FROM courses`),
    p.query(`SELECT count(*)::int as pending FROM payments WHERE status = 'pending'`),
    p.query(`SELECT count(*)::int as total, count(*) FILTER (WHERE is_used)::int as used FROM access_codes`),
  ]);
  res.status(200).json({
    totalStudents: usersR.rows[0].n,
    totalCourses: coursesR.rows[0].n,
    pendingPayments: paymentsR.rows[0].pending,
    totalCodes: codesR.rows[0].total,
    usedCodes: codesR.rows[0].used,
  });
}

async function handleUsers(_req: any, res: any): Promise<void> {
  const { rows } = await getPool().query(
    `SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC`
  );
  res.status(200).json(rows.map((u: any) => ({
    id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.created_at,
  })));
}

async function handlePayments(_req: any, res: any): Promise<void> {
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
}

async function handleCodes(req: any, res: any): Promise<void> {
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
    const code = b.code || randomBytes(4).toString("hex").toUpperCase();
    const { rows } = await p.query(
      `INSERT INTO access_codes (code, course_id) VALUES ($1, $2) RETURNING *`,
      [String(code).toUpperCase(), courseId]
    );
    res.status(201).json({ id: rows[0].id, code: rows[0].code, courseId: rows[0].course_id });
    return;
  }
  res.status(405).json({ error: "Method not allowed" });
}

export default async function handler(req: any, res: any): Promise<void> {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }

  const auth = req.headers.authorization as string | undefined;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || !verifyAdmin(token)) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    await ensureSchema(getPool());
    const type = req.query.type as string;

    switch (type) {
      case "stats":    return handleStats(req, res);
      case "users":    return handleUsers(req, res);
      case "payments": return handlePayments(req, res);
      case "codes":    return handleCodes(req, res);
      default:         res.status(404).json({ error: "Not found" }); return;
    }
  } catch (err: unknown) {
    console.error("[admin/manage]", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "Internal server error" });
  }
}
