---
name: Albayaan Storage & URL conventions
description: Supabase Storage upload flow, env var conventions, bucket names, and URL resolution patterns.
---

# Supabase Storage Upload Flow

Two endpoints in `artifacts/api-server/src/routes/storage.ts`:
- `POST /api/storage/upload-url` — returns a signed URL so the client uploads directly to Supabase (no file passes through the server). Used by `FileUploader.tsx`.
- `POST /api/storage/upload` — legacy server-side buffered upload.

Both use `artifacts/api-server/src/lib/supabaseAdmin.ts`.

**Required secrets/env vars on the API server:**
- `SUPABASE_URL` (shared env) — correct value: `https://xokrirmhuxhugofgheev.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` (Replit secret)

**Why:** Without these the server logs a warning and uploads return 500.

**IMPORTANT — correct Supabase project URL:** `xokrirmhuxhugofgheev.supabase.co`  
The old URL `xokrrmqzawztxlnwdruf.supabase.co` was a typo and that domain does not resolve. Always verify SUPABASE_URL matches the ref in the JWT keys.

# Storage Buckets

Buckets are auto-created on server startup via `ensureStorageBucket()` in supabaseAdmin.ts.
Current buckets: `videos`, `thumbnails`, `documents`, `certificates` (plus legacy `course-media`).
Content-type routing: video/* → videos, image/* → thumbnails, pdf/docs → documents.

**Why:** The old code used a single `course-media` bucket but the platform creates 4 typed buckets now. Both exist in the project.

# URL Convention for Production

Set `VITE_API_BASE_URL` = API base **including** `/api`, e.g. `https://api.albayaan.pro/api`.

- `adminFetch(url)`: takes full paths like `/api/admin/courses` — strips leading `/api` before prepending base
- `getApiUrl(path)`: takes paths without `/api` like `/storage/upload-url` — prepends base directly
- On the API server: `SUPABASE_SERVICE_ROLE_KEY` must also be set.

**Why:** Frontend served from Vercel (static) + API server deployed separately. Vite proxy handles `/api/*` in dev.

# Workflows

- API Server: `PORT=8080 pnpm --filter @workspace/api-server run dev` (console, port 8080)
- Frontend: `PORT=8081 pnpm --filter @workspace/learning-platform run dev` (webview, port 8081 → external 80)
