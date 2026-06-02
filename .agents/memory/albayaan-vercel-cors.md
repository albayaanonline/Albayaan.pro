---
name: Albayaan Vercel CORS Bug
description: Three interlocking CORS/auth bugs in the Vercel deployment that caused upload 500 errors and course-save network errors.
---

## The bugs

### 1. wildcard CORS + credentials in vercel.json (primary)
`vercel.json` had static headers `Access-Control-Allow-Origin: *` + `Access-Control-Allow-Credentials: true` on `/api/(.*)`. This is rejected by all browsers per the CORS spec — wildcard origin cannot be combined with `credentials: include`. Vercel applies static headers AFTER serverless function headers, overriding the function's correct specific-origin header.

**Fix:** Remove the `/api/(.*)` static CORS header block entirely. The serverless function already sets correct per-request origin headers.

### 2. Admin role lives in local DB, not Supabase app_metadata
`api/storage/upload-url.ts` checked `user.app_metadata.role` to decide if the caller is admin. Albayaan stores admin role only in the local PostgreSQL `users` table (via Drizzle). Supabase `app_metadata.role` is never set, so every admin call returned 401.

**Fix:** After the Supabase metadata check (fast path), fall back to a direct `pg` query: `SELECT role FROM users WHERE email = $1`. Requires `DATABASE_URL` env var in the frontend Vercel deployment, and `pg` added to `artifacts/learning-platform/package.json`.

### 3. Session cookie missing sameSite:none
`vercel-entry.ts` session cookie had no `sameSite` config, defaulting to Lax. Cross-site POST requests don't send Lax cookies. Added `sameSite: "none"` (requires `secure: true`, already set).

**Why:** `credentials: include` on cross-origin fetch only works if the cookie has `SameSite=None; Secure`.

## Env vars required in EACH Vercel deployment

**Frontend deployment** (`artifacts/learning-platform/`):
- `SUPABASE_URL` or `VITE_SUPABASE_URL`
- `SUPABASE_ANON_KEY` or `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — for the upload-url serverless function
- `DATABASE_URL` — for the DB-based admin role fallback in upload-url

**API server deployment** (`artifacts/api-server/`):
- `DATABASE_URL`
- `SESSION_SECRET`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_API_BASE_URL` is a frontend build-time var — set on the frontend deployment
