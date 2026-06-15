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

  try {
    const { rows } = await pool.query(`
      SELECT
        c.id,
        c.slug,
        c.title,
        c.title_ar        AS "titleAr",
        c.title_so        AS "titleSo",
        c.description,
        c.description_ar  AS "descriptionAr",
        c.description_so  AS "descriptionSo",
        c.language,
        c.level,
        c.price,
        c.duration,
        c.thumbnail_url   AS "thumbnailUrl",
        c.enrolled_count  AS "enrolledCount",
        c.is_published    AS "isPublished",
        COUNT(l.id)::int  AS "lessonCount"
      FROM courses c
      LEFT JOIN lessons l ON l.course_id = c.id
      WHERE c.is_published = true
      GROUP BY c.id
      ORDER BY c.id ASC
    `);
    res.status(200).json(rows);
  } catch (err: unknown) {
    console.error("[GET /api/courses]", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
