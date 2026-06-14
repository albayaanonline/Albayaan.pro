import { Pool } from "pg";
import bcrypt from "bcryptjs";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    pool = new Pool({ connectionString: url, max: 5 });
  }
  return pool;
}

export function setCors(req: any, res: any): void {
  const origin = (req.headers.origin as string | undefined) ?? "";
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export async function ensureSchema(p: Pool): Promise<void> {
  await p.query(`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" serial PRIMARY KEY,
      "name" text NOT NULL,
      "email" text NOT NULL UNIQUE,
      "password_hash" text NOT NULL,
      "role" text NOT NULL DEFAULT 'user',
      "created_at" timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS "courses" (
      "id" serial PRIMARY KEY,
      "slug" text NOT NULL UNIQUE,
      "title" text NOT NULL,
      "title_ar" text NOT NULL DEFAULT '',
      "title_so" text NOT NULL DEFAULT '',
      "description" text NOT NULL DEFAULT '',
      "description_ar" text NOT NULL DEFAULT '',
      "description_so" text NOT NULL DEFAULT '',
      "language" text NOT NULL DEFAULT 'english',
      "level" text NOT NULL DEFAULT 'beginner',
      "price" real NOT NULL DEFAULT 0,
      "duration" text NOT NULL DEFAULT '0h',
      "thumbnail_url" text,
      "enrolled_count" integer NOT NULL DEFAULT 0,
      "is_published" boolean NOT NULL DEFAULT false,
      "created_at" timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS "lessons" (
      "id" serial PRIMARY KEY,
      "course_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
      "title" text NOT NULL,
      "title_ar" text NOT NULL DEFAULT '',
      "title_so" text NOT NULL DEFAULT '',
      "order" integer NOT NULL DEFAULT 1,
      "duration" text NOT NULL DEFAULT '5m',
      "is_locked" boolean NOT NULL DEFAULT true,
      "has_quiz" boolean NOT NULL DEFAULT false,
      "content" text NOT NULL DEFAULT '',
      "content_ar" text NOT NULL DEFAULT '',
      "content_so" text NOT NULL DEFAULT '',
      "video_url" text,
      "pdf_url" text,
      "created_at" timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS "access_codes" (
      "id" serial PRIMARY KEY,
      "code" text NOT NULL UNIQUE,
      "course_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
      "is_active" boolean NOT NULL DEFAULT true,
      "is_used" boolean NOT NULL DEFAULT false,
      "used_by_user_id" integer REFERENCES "users"("id"),
      "used_at" timestamptz,
      "created_at" timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS "payments" (
      "id" serial PRIMARY KEY,
      "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "course_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
      "status" text NOT NULL DEFAULT 'pending',
      "whatsapp_number" text NOT NULL,
      "notes" text,
      "access_code" text,
      "created_at" timestamptz NOT NULL DEFAULT now(),
      "updated_at" timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS "course_enrollments" (
      "id" serial PRIMARY KEY,
      "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "course_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
      "is_completed" boolean NOT NULL DEFAULT false,
      "completed_at" timestamptz,
      "enrolled_at" timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS "lesson_progress" (
      "id" serial PRIMARY KEY,
      "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "lesson_id" integer NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
      "course_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
      "completed_at" timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS "testimonials" (
      "id" serial PRIMARY KEY,
      "name" text NOT NULL,
      "text" text NOT NULL,
      "rating" integer NOT NULL DEFAULT 5,
      "course_id" integer NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
      "avatar_url" text,
      "created_at" timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS "certificates" (
      "id" serial PRIMARY KEY,
      "cert_id" text NOT NULL UNIQUE,
      "user_id" integer NOT NULL,
      "course_id" integer NOT NULL,
      "student_name" text NOT NULL,
      "course_name" text NOT NULL,
      "issued_at" timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS "user_sessions" (
      "sid" varchar NOT NULL,
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL,
      CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
    );
    CREATE INDEX IF NOT EXISTS "IDX_user_sessions_expire" ON "user_sessions" ("expire");
    CREATE TABLE IF NOT EXISTS "user_gamification" (
      "id" serial PRIMARY KEY,
      "user_id" integer NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
      "xp" integer NOT NULL DEFAULT 0,
      "level" integer NOT NULL DEFAULT 1,
      "streak" integer NOT NULL DEFAULT 0,
      "last_active_date" text,
      "badges" text[] NOT NULL DEFAULT '{}',
      "total_exercises" integer NOT NULL DEFAULT 0,
      "correct_answers" integer NOT NULL DEFAULT 0,
      "updated_at" timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS "exercises" (
      "id" serial PRIMARY KEY,
      "lesson_id" integer NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
      "type" text NOT NULL,
      "question" text NOT NULL,
      "question_ar" text NOT NULL DEFAULT '',
      "question_so" text NOT NULL DEFAULT '',
      "options" text[],
      "correct_answer" text NOT NULL,
      "explanation" text NOT NULL DEFAULT '',
      "xp_reward" integer NOT NULL DEFAULT 10,
      "order" integer NOT NULL DEFAULT 1,
      "created_at" timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS "exercise_attempts" (
      "id" serial PRIMARY KEY,
      "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "exercise_id" integer NOT NULL REFERENCES "exercises"("id") ON DELETE CASCADE,
      "is_correct" boolean NOT NULL,
      "user_answer" text NOT NULL,
      "answered_at" timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS "contact_messages" (
      "id" serial PRIMARY KEY,
      "name" text NOT NULL,
      "email" text NOT NULL,
      "message" text NOT NULL,
      "created_at" timestamptz NOT NULL DEFAULT now()
    );
  `);
}

export async function seedIfEmpty(p: Pool): Promise<void> {
  const { rows } = await p.query(`SELECT count(*)::int as n FROM courses`);
  if (rows[0].n > 0) return;

  console.log("[seed] Empty DB — seeding initial data…");

  const adminHash = await bcrypt.hash("admin123", 10);
  const studentHash = await bcrypt.hash("admin123", 10);

  await p.query(`
    INSERT INTO users (name, email, password_hash, role) VALUES
      ('Admin', 'admin@ilmai.so', $1, 'admin'),
      ('Axmed Demo', 'axmed@example.com', $2, 'user')
    ON CONFLICT (email) DO NOTHING;
  `, [adminHash, studentHash]);

  await p.query(`
    INSERT INTO courses (slug, title, title_ar, title_so, description, description_ar, description_so, language, level, price, duration, enrolled_count, is_published) VALUES
    (
      'english-language',
      'English Language Course',
      'دورة اللغة الإنجليزية',
      'Koorsada Luqadda Ingiriisiga',
      'Master English from beginner to advanced with our comprehensive course designed for Somali speakers.',
      'أتقن اللغة الإنجليزية من المبتدئ إلى المتقدم مع دورتنا الشاملة المصممة للناطقين بالصومالية.',
      'Ku soo if bax Ingiriisiga laga bilaabo heerka bilowga ilaa heerka sare ee kursigayaga dhamaystiran.',
      'english', 'beginner', 25, '12h', 0, true
    ),
    (
      'arabic-language',
      'Arabic Language Course',
      'دورة اللغة العربية',
      'Koorsada Luqadda Carabiga',
      'Learn Arabic language with focus on Modern Standard Arabic and conversational skills for Somali speakers.',
      'تعلم اللغة العربية مع التركيز على العربية الفصحى الحديثة ومهارات المحادثة للناطقين بالصومالية.',
      'Baranso afka Carabiga oo xoogga saara Carabiga caadiga ah iyo xirfadaha wadahadalka.',
      'arabic', 'beginner', 25, '10h', 0, true
    )
    ON CONFLICT (slug) DO NOTHING
    RETURNING id;
  `);

  await p.query(`
    INSERT INTO lessons (course_id, title, title_ar, title_so, "order", duration, is_locked, content, content_ar, content_so, video_url)
    SELECT c.id, 'English Beginner – Introduction', 'مقدمة للمبتدئين في الإنجليزية', 'Hordhac Ingiriisiga – Bilow',
      1, '45m', false,
      'Welcome to the English Language Course! In this lesson we cover the basics of English including the alphabet, pronunciation, and basic greetings.',
      'مرحباً بك في دورة اللغة الإنجليزية! في هذا الدرس، سنتناول أساسيات اللغة الإنجليزية.',
      'Ku soo dhawoow Koorsada Luqadda Ingiriisiga!',
      '/videos/english-beginner-intro.mp4'
    FROM courses c WHERE c.slug = 'english-language'
    ON CONFLICT DO NOTHING;

    INSERT INTO lessons (course_id, title, title_ar, title_so, "order", duration, is_locked, content, content_ar, content_so)
    SELECT c.id, 'Basic Grammar', 'القواعد الأساسية', 'Naxwaha Aasaasiga', 2, '60m', true,
      'In this lesson, we explore the fundamental grammar rules of English including nouns, verbs, adjectives, and sentence structure.',
      'في هذا الدرس، نستكشف قواعد النحو الأساسية للغة الإنجليزية.',
      'Casharkaan, waxaan baranayaa xeerarka naxwaha ee aasaasiga ah ee Ingiriisiga.'
    FROM courses c WHERE c.slug = 'english-language'
    ON CONFLICT DO NOTHING;

    INSERT INTO lessons (course_id, title, title_ar, title_so, "order", duration, is_locked, content, content_ar, content_so)
    SELECT c.id, 'Vocabulary Building', 'بناء المفردات', 'Dhisidda Erayada', 3, '50m', true,
      'Expand your English vocabulary with essential everyday words and phrases.',
      'وسّع مفرداتك في اللغة الإنجليزية بالكلمات والعبارات اليومية الأساسية.',
      'Ballaari erayadaada Ingiriisiga adiga oo isticmaalaya erayada muhiimka ah ee maalinlaha ah.'
    FROM courses c WHERE c.slug = 'english-language'
    ON CONFLICT DO NOTHING;

    INSERT INTO lessons (course_id, title, title_ar, title_so, "order", duration, is_locked, content, content_ar, content_so)
    SELECT c.id, 'Speaking & Conversation', 'التحدث والمحادثة', 'Hadlida & Wada-hadalka', 4, '55m', true,
      'Practice real-world English conversations covering greetings, introductions, and common daily interactions.',
      'تدرب على محادثات اللغة الإنجليزية في العالم الحقيقي.',
      'Ku celcelis wadahadalada Ingiriisiga ee nolosha dhabta ah.'
    FROM courses c WHERE c.slug = 'english-language'
    ON CONFLICT DO NOTHING;

    INSERT INTO lessons (course_id, title, title_ar, title_so, "order", duration, is_locked, content, content_ar, content_so)
    SELECT c.id, 'Reading & Writing', 'القراءة والكتابة', 'Akhrinta & Qorista', 5, '65m', true,
      'Develop your English reading and writing skills.',
      'طوّر مهارات القراءة والكتابة في اللغة الإنجليزية.',
      'Horumarso xirfadahaaga akhrinta iyo qorista ee Ingiriisiga.'
    FROM courses c WHERE c.slug = 'english-language'
    ON CONFLICT DO NOTHING;

    INSERT INTO lessons (course_id, title, title_ar, title_so, "order", duration, is_locked, content, content_ar, content_so)
    SELECT c.id, 'Introduction to Arabic', 'مقدمة في اللغة العربية', 'Hordhac Carabiga', 1, '45m', false,
      'Welcome to the Arabic Language Course! Learn the Arabic alphabet, basic pronunciation, and essential greetings.',
      'مرحباً بك في دورة اللغة العربية! تعلم الأبجدية العربية والنطق الأساسي.',
      'Ku soo dhawoow Koorsada Luqadda Carabiga!'
    FROM courses c WHERE c.slug = 'arabic-language'
    ON CONFLICT DO NOTHING;

    INSERT INTO lessons (course_id, title, title_ar, title_so, "order", duration, is_locked, content, content_ar, content_so)
    SELECT c.id, 'Arabic Alphabet & Script', 'الحروف العربية والخط', 'Xarfaha Carabiga & Qoraalka', 2, '60m', true,
      'Master the 28 letters of the Arabic alphabet.',
      'أتقن الحروف الـ28 من الأبجدية العربية.',
      'Ku soo if bax 28-ka xaraf ee alifbeetada Carabiga.'
    FROM courses c WHERE c.slug = 'arabic-language'
    ON CONFLICT DO NOTHING;

    INSERT INTO lessons (course_id, title, title_ar, title_so, "order", duration, is_locked, content, content_ar, content_so)
    SELECT c.id, 'Basic Arabic Grammar', 'قواعد النحو العربي الأساسية', 'Naxwaha Carabiga Aasaasiga', 3, '55m', true,
      'Understand the fundamental grammar of Arabic.',
      'افهم قواعد النحو الأساسية للغة العربية.',
      'Fahmo naxwaha aasaasiga ah ee Carabiga.'
    FROM courses c WHERE c.slug = 'arabic-language'
    ON CONFLICT DO NOTHING;

    INSERT INTO lessons (course_id, title, title_ar, title_so, "order", duration, is_locked, content, content_ar, content_so)
    SELECT c.id, 'Arabic Vocabulary', 'المفردات العربية', 'Erayada Carabiga', 4, '50m', true,
      'Build your Arabic vocabulary with common words used in daily life.',
      'بناء مفرداتك العربية بالكلمات الشائعة المستخدمة في الحياة اليومية.',
      'Dhis erayadaada Carabiga adiga oo isticmaalaya erayada caadiga ah ee nolosha maalinlaha ah.'
    FROM courses c WHERE c.slug = 'arabic-language'
    ON CONFLICT DO NOTHING;

    INSERT INTO lessons (course_id, title, title_ar, title_so, "order", duration, is_locked, content, content_ar, content_so)
    SELECT c.id, 'Conversational Arabic', 'المحادثة بالعربية', 'Wadahadalka Carabiga', 5, '60m', true,
      'Practice conversational Arabic with real-life dialogues.',
      'تدرب على المحادثة بالعربية مع حوارات من الحياة الواقعية.',
      'Ku celcelis wadahadalka Carabiga adiga oo isticmaalaya wadahadalada nolosha dhabta ah.'
    FROM courses c WHERE c.slug = 'arabic-language'
    ON CONFLICT DO NOTHING;
  `);

  await p.query(`
    INSERT INTO access_codes (code, course_id, is_active, is_used)
    SELECT 'ENGLISH-FREE', c.id, true, false FROM courses c WHERE c.slug = 'english-language'
    ON CONFLICT (code) DO NOTHING;

    INSERT INTO access_codes (code, course_id, is_active, is_used)
    SELECT 'DEMO2024', c.id, true, false FROM courses c WHERE c.slug = 'english-language'
    ON CONFLICT (code) DO NOTHING;

    INSERT INTO access_codes (code, course_id, is_active, is_used)
    SELECT 'ARABIC-FREE', c.id, true, false FROM courses c WHERE c.slug = 'arabic-language'
    ON CONFLICT (code) DO NOTHING;
  `);

  console.log("[seed] ✅ Seeded: 2 courses, 10 lessons, 3 demo codes");
}
