---
name: Albayaan Publish System
description: Course publish/unpublish feature — how it works end-to-end.
---

## Schema
`courses.is_published BOOLEAN NOT NULL DEFAULT FALSE`

## API Endpoints
- `GET /api/courses` — returns only `isPublished=true` courses (student-facing)
- `GET /api/admin/courses` — returns ALL courses with `isPublished` field (admin-facing)
- `PATCH /api/admin/courses/:id/publish` — body `{ isPublished: boolean }` — toggles publish state

## Admin Dashboard UI
- Course cards show green "Published" or gray "Draft" badge
- "Publish" / "Unpublish" button per course card (desktop + mobile)
- Summary bar shows count of published vs draft courses
- `togglingPublish: number | null` state tracks which course is being toggled

**Why:** Students should only see published courses. Admins need to draft courses before making them live.

**How to apply:** When creating a new course via POST /admin/courses, pass `isPublished: false` (default). Admin can then toggle it live.
