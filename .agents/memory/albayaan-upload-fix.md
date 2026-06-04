---
name: Albayaan Upload Fix
description: Three root causes of "Failed to get upload URL (500/401)" and how they were fixed.
---

## Bug 1 — Supabase signed URL has no `token` field (500 error)

**File**: `artifacts/api-server/src/lib/supabaseAdmin.ts`

Supabase Storage `createSignedUploadUrl` API returns `{ url: "/object/upload/sign/bucket/path?token=xxx" }` — there is **no separate `token` field**. The old code checked `!data.token` which always threw. Fix: remove the `!data.token` check; extract token from the URL's query string if needed.

**Why:** Supabase API shape changed / was never what the code assumed.

## Bug 2 — `isAdminRequest` only accepted Bearer tokens (401 for session-cookie admins)

**File**: `artifacts/api-server/src/routes/storage.ts`

The admin guard for `/api/storage/upload-url` only checked for a Supabase Bearer token. Admins logging in via the local `/api/auth/login` session flow had no Bearer token. Fix: check `req.session?.userId` + DB role as Path 1, Bearer token as Path 2.

## Bug 3 — `connect-pg-simple` `createTableIfMissing` breaks in esbuild bundle (sessions not persisted)

**Files**: `artifacts/api-server/src/app.ts`, `artifacts/api-server/src/index.ts`

`createTableIfMissing: true` causes `connect-pg-simple` to read `./table.sql` from `__dirname` at runtime. In the esbuild bundle, `__dirname` is `dist/` — the SQL file is not copied there, so it throws ENOENT on every login. Sessions were never saved; every upload request returned 401.

**Fix**: 
- Set `createTableIfMissing: false` in PgSession config (`app.ts`)
- Add `ensureSessionTable()` in `index.ts` that runs `CREATE TABLE IF NOT EXISTS "user_sessions" ...` using the pool at server startup

**Why:** esbuild bundles JS only — non-JS assets (like `.sql` files) must be handled separately or inlined.

**How to apply:** Any time `connect-pg-simple` (or any library) uses `__dirname` + `fs.readFile` to load a non-JS file, it will fail in an esbuild bundle. Either copy the file into `dist/` in the build script, or inline the content in TypeScript.
