import { getPool, setCors, ensureSchema } from "../_db";
import { createHmac } from "crypto";

function getSecret() { return process.env.SESSION_SECRET ?? "albayaan-secret-fallback"; }
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
    if (Date.now() > parseInt(parts[parts.length - 1], 10)) return null;
    const userId = parseInt(parts[0], 10);
    if (isNaN(userId)) return null;
    return { userId, role: parts.slice(1, -1).join(":") };
  } catch { return null; }
}

export default async function handler(req: any, res: any): Promise<void> {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }

  const auth = req.headers.authorization as string | undefined;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  const claims = token ? verifyToken(token) : null;
  if (!claims) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    await ensureSchema(getPool());
    const p = getPool();

    if (req.method === "GET") {
      const { rows: enrollments } = await p.query(
        `SELECT e.course_id, e.is_completed, e.enrolled_at,
                count(lp.id)::int as completed_lessons,
                (SELECT count(*)::int FROM lessons l WHERE l.course_id = e.course_id) as total_lessons
         FROM course_enrollments e
         LEFT JOIN lesson_progress lp ON lp.user_id = e.user_id AND lp.course_id = e.course_id
         WHERE e.user_id = $1
         GROUP BY e.course_id, e.is_completed, e.enrolled_at`,
        [claims.userId]
      );
      res.status(200).json(enrollments.map((r: any) => ({
        courseId: r.course_id,
        isCompleted: r.is_completed,
        enrolledAt: r.enrolled_at,
        completedLessons: r.completed_lessons,
        totalLessons: r.total_lessons,
        percentComplete: r.total_lessons > 0 ? Math.round((r.completed_lessons / r.total_lessons) * 100) : 0,
      })));
      return;
    }

    if (req.method === "POST") {
      const { lessonId, courseId } = (req.body as Record<string, any>) ?? {};
      if (!lessonId || !courseId) { res.status(400).json({ error: "lessonId and courseId required" }); return; }
      await p.query(
        `INSERT INTO lesson_progress (user_id, lesson_id, course_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
        [claims.userId, Number(lessonId), Number(courseId)]
      );
      // Check if all lessons completed
      const { rows: [prog] } = await p.query(
        `SELECT count(lp.id)::int as done,
                (SELECT count(*)::int FROM lessons WHERE course_id = $2) as total
         FROM lesson_progress lp WHERE lp.user_id = $1 AND lp.course_id = $2`,
        [claims.userId, Number(courseId)]
      );
      if (prog.done >= prog.total && prog.total > 0) {
        await p.query(
          `UPDATE course_enrollments SET is_completed = true, completed_at = now()
           WHERE user_id = $1 AND course_id = $2 AND is_completed = false`,
          [claims.userId, Number(courseId)]
        );
      }
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[progress]", msg);
    res.status(500).json({ error: "Internal server error" });
  }
}
