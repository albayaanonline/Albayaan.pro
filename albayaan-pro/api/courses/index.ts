import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    console.log("[courses] DATABASE_URL present:", Boolean(url));
    if (!url) throw new Error("DATABASE_URL is not set");
    pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
    console.log("[courses] Pool created");
  }
  return pool;
}

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
    const db = getPool();
    console.log("[courses] Executing query...");
    const { rows } = await db.query(`
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
    console.log("[courses] Query succeeded, rows:", rows.length);
    res.status(200).json(rows);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[GET /api/courses] EXCEPTION:", msg);
    if (stack) console.error("[GET /api/courses] STACK:", stack);
    res.status(500).json({ error: msg, stack });
  }
}
