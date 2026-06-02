---
name: Albayaan Storage & URL conventions
description: Supabase Storage upload flow, env var conventions, and URL resolution patterns for uploads and admin API calls.
---

# Supabase Storage Upload Flow

Backend route: `POST /api/storage/upload` in `artifacts/api-server/src/routes/storage.ts`.
Uses `artifacts/api-server/src/lib/supabaseAdmin.ts` — requires `SUPABASE_SERVICE_ROLE_KEY` env var on the API server.

**Without SUPABASE_SERVICE_ROLE_KEY the backend logs a warning and uploads return 500.**

Bucket name: `albayaan-media` (auto-created in `ensureStorageBucket()`).

# URL Convention for Production

Set `VITE_API_BASE_URL` = API base **including** `/api`, e.g. `https://api.albayaan.pro/api`.

- `adminFetch(url)`: takes full paths like `/api/admin/courses` — strips leading `/api` before prepending base → `https://api.albayaan.pro/api/admin/courses` ✓
- `getApiUrl(path)`: takes paths without `/api` like `/storage/upload` — prepends base directly → `https://api.albayaan.pro/api/storage/upload` ✓
- On the API server: `SUPABASE_SERVICE_ROLE_KEY` must also be set.

**Why:** Frontend served from Vercel (static) + API server deployed separately. Vite proxy handles `/api/*` in dev.
