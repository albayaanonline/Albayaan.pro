import { getPool, setCors, ensureSchema } from "../_db";

export default async function handler(req: any, res: any): Promise<void> {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }

  const certId = String(req.query.certId ?? "").trim();
  if (!certId) { res.status(400).json({ error: "certId is required" }); return; }

  try {
    await ensureSchema(getPool());
    const { rows } = await getPool().query(
      `SELECT cert_id, student_name, course_name, issued_at FROM certificates WHERE cert_id = $1 LIMIT 1`,
      [certId]
    );
    if (!rows[0]) { res.status(404).json({ error: "Certificate not found" }); return; }
    const c = rows[0];
    res.status(200).json({
      certId: c.cert_id,
      studentName: c.student_name,
      courseName: c.course_name,
      issuedAt: c.issued_at,
      valid: true,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[certificates/[certId]]", msg);
    res.status(500).json({ error: "Internal server error" });
  }
}
