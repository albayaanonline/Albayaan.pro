import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function setCors(req: VercelRequest, res: VercelResponse): void {
  const origin = (req.headers.origin as string | undefined) || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  if (req.method !== "GET") { res.status(405).json({ error: "Method not allowed" }); return; }

  const id = parseInt(String(req.query.lessonId), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid lesson ID" }); return; }

  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        course_id   AS "courseId",
        title,
        title_ar    AS "titleAr",
        title_so    AS "titleSo",
        "order",
        duration,
        is_locked   AS "isLocked",
        has_quiz    AS "hasQuiz",
        content,
        content_ar  AS "contentAr",
        content_so  AS "contentSo",
        video_url   AS "videoUrl",
        pdf_url     AS "pdfUrl"
      FROM lessons
      WHERE id = $1
    `, [id]);

    const lesson = rows[0];
    if (!lesson) { res.status(404).json({ error: "Lesson not found" }); return; }

    res.status(200).json(lesson);
  } catch (err: unknown) {
    console.error("[GET /api/lessons/:id]", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
