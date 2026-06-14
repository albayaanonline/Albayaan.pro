import { getPool, setCors, ensureSchema, seedIfEmpty } from "./_db";

let initialized = false;

async function init() {
  if (initialized) return;
  const p = getPool();
  await ensureSchema(p);
  await seedIfEmpty(p);
  initialized = true;
}

export default async function handler(req: any, res: any): Promise<void> {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }

  try {
    await init();
    const p = getPool();

    const { rows: courses } = await p.query(`
      SELECT id, slug, title, title_ar, title_so, description, description_ar, description_so,
             language, level, price, duration, thumbnail_url, enrolled_count, is_published
      FROM courses
      WHERE is_published = true
      ORDER BY id
    `);

    const { rows: lessonCounts } = await p.query(`
      SELECT course_id, count(*)::int as cnt FROM lessons GROUP BY course_id
    `);

    const countMap = new Map(lessonCounts.map((r: any) => [r.course_id, r.cnt]));

    res.status(200).json(courses.map((c: any) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      titleAr: c.title_ar,
      titleSo: c.title_so,
      description: c.description,
      descriptionAr: c.description_ar,
      descriptionSo: c.description_so,
      language: c.language,
      level: c.level,
      price: Number(c.price),
      lessonCount: countMap.get(c.id) ?? 0,
      duration: c.duration,
      thumbnailUrl: c.thumbnail_url ?? null,
      enrolledCount: c.enrolled_count,
      isPublished: c.is_published,
    })));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[api/courses]", msg);
    res.status(500).json({ error: msg });
  }
}
