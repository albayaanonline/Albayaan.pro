---
name: Albayaan DB Migration
description: How to push schema changes and DB table status for the Albayaan platform.
---

## Schema Push Command
```bash
pnpm --filter @workspace/db push-force
```
This runs `drizzle-kit push --force` using `lib/db/drizzle.config.ts`.

## Current Tables (14)
access_codes, certificates, course_enrollments, courses, exercise_attempts, exercises,
lesson_progress, lessons, payments, quiz_questions, quizzes, testimonials,
user_gamification, users

## Key Schema Notes
- `courses.is_published` — boolean NOT NULL DEFAULT FALSE. Controls whether students can see the course via public `/api/courses` endpoint.
- `pg` module in workspace: `node_modules/.pnpm/pg@8.20.0/node_modules/pg`
- Drizzle does NOT auto-migrate — always run push-force after schema changes.
- DB was found completely empty (0 tables) — had to push schema before any DB queries would work.

**Why:** The schema was empty on fresh DB; push-force creates all tables from scratch safely.

**How to apply:** Any new column/table added to `lib/db/src/schema/*.ts` requires running `pnpm --filter @workspace/db push-force` before the API server can use it.

## Admin User Seeding
Admin user is seeded via ON CONFLICT upsert:
```sql
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin', '<email>', 'supabase-auth', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';
```
After a fresh DB, run this for the registered Supabase user's email before they try to upload.
Alternatively, POST /admin/elevate { email, secret: ADMIN_ELEVATION_SECRET } after they log in once.
