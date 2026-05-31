---
name: Albayaan DB Migration
description: How to push schema changes and DB table status for the Albayaan platform.
---

## Schema Push Command
```bash
pnpm --filter @workspace/db push-force
```
This runs `drizzle-kit push --force` using `lib/db/drizzle.config.ts`.

## Current Tables (11)
access_codes, certificates, course_enrollments, courses, lesson_progress, lessons, payments, quiz_questions, quizzes, testimonials, users

## Key Schema Notes
- `courses.is_published` — boolean NOT NULL DEFAULT FALSE. Added in this session. Controls whether students can see the course via public `/api/courses` endpoint.
- `pg` module in workspace: `node_modules/.pnpm/pg@8.20.0/node_modules/pg`
- Drizzle does NOT auto-migrate — always run push-force after schema changes.

**Why:** The schema was empty on fresh DB; push-force creates all tables from scratch safely.

**How to apply:** Any new column/table added to `lib/db/src/schema/*.ts` requires running `pnpm --filter @workspace/db push-force` before the API server can use it.
