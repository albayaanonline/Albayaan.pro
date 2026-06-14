import { getPool, setCors, ensureSchema, seedIfEmpty } from "../_db";

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

  const courseId = req.query.courseId;
  const id = parseInt(String(courseId), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid courseId" });
    return;
  }

  try {
    await init();
    const p = getPool();

    const { rows: courseRows } = await p.query(
      `SELECT * FROM courses WHERE id = $1 LIMIT 1`, [id]
    );
    const course = courseRows[0];
    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    const { rows: lessons } = await p.query(
      `SELECT id, course_id, title, title_ar, title_so, "order", duration, is_locked, has_quiz, video_url
       FROM lessons WHERE course_id = $1 ORDER BY "order"`, [id]
    );

    res.status(200).json({
      id: course.id,
      slug: course.slug,
      title: course.title,
      titleAr: course.title_ar,
      titleSo: course.title_so,
      description: course.description,
      descriptionAr: course.description_ar,
      descriptionSo: course.description_so,
      language: course.language,
      level: course.level,
      price: Number(course.price),
      lessonCount: lessons.length,
      duration: course.duration,
      thumbnailUrl: course.thumbnail_url ?? null,
      enrolledCount: course.enrolled_count,
      isPublished: course.is_published,
      lessons: lessons.map((l: any) => ({
        id: l.id,
        courseId: l.course_id,
        title: l.title,
        titleAr: l.title_ar,
        titleSo: l.title_so,
        order: l.order,
        duration: l.duration,
        isLocked: l.is_locked,
        hasQuiz: l.has_quiz,
        videoUrl: l.video_url ?? null,
      })),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[api/courses/[courseId]]", msg);
    res.status(500).json({ error: msg });
  }
}
