---
name: Albayaan Admin Dashboard API
description: AdminDashboard.tsx is fully connected to real API — no static COURSES data remains.
---

# Admin Dashboard API integration

## Rule
Every data display in AdminDashboard (overview, courses, analytics, certificates, codes tabs) reads from `apiCourses` (fetched via `useQuery` from `/api/admin/courses`), not from the static `COURSES` import.

## What was done
- Removed `import { COURSES, type Course, type Lesson }` entirely.
- All tabs (analytics, certificates, overview charts) now use `apiCourses` with `?? 0` null-safety for `enrolledCount`, `price`, `lessonCount`.
- Fields that don't exist in API (`rating`, `category`, `thumbnail`, `color`) replaced with: `enrolledCount ?? 0`, `price ?? 0`, `BookOpen`/`Award` icons, level-based gradient classes.
- `editingCourse`, `deletingCourse`, `expandedLesson` state are all `number | null` (API course id is a number).
- `handleDeleteCourse` signature is `(id: number)`.
- Lesson expand section shows `course.lessonCount ?? 0` instead of iterating `course.lessons.map(...)` (no lessons array in API response).

## Why
`/api/admin/courses` returns DB records from the courses table — numeric IDs, no rating/category/thumbnail/color/lessons array fields.

## How to apply
When adding new admin dashboard features that need course data, always use `apiCourses` and add `?? 0` / `?? ""` fallbacks for optional fields. Never re-import COURSES local data.
