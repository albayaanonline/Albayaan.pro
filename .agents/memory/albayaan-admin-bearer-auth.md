---
name: Albayaan Admin Bearer Token Auth
description: Production admin login/upload used to fail 401 because the API server project was misconfigured. Fix: HMAC Bearer token approach, Vercel serverless fns in albayaan-pro/api/.
---

## Root Cause

`albayaan-pro-api-server.vercel.app` was deploying the `albayaan-pro/` SPA (not the Express server). Result:
- `POST /api/auth/login` → 405 (no serverless function existed, admin cannot log in)
- `POST /api/storage/upload-url` → 401 (one old fn existed, but no session/token)
- Additionally: `vercel-entry.ts` was missing `sameSite:"none"` on session cookies (cross-origin cookies would still fail even with proper Express deployment)

## Fix Applied

**Token format:** `base64url(userId:role:expiresMs:hmacSHA256)` — HMAC-signed, stateless, no session store needed.

**Server side** (`artifacts/api-server/src/`):
- `lib/adminToken.ts` — `createAdminToken(userId, role)` and `verifyAdminToken(token)` using HMAC-SHA256
- `routes/auth.ts` — `POST /auth/login` now returns `token` field in JSON; `GET /auth/me` accepts Bearer token (custom HMAC OR Supabase)
- `routes/storage.ts` — `isAdminRequest()` now has Path 2: custom HMAC token (fast, no external call) before falling through to Supabase token
- `vercel-entry.ts` — added `sameSite:"none"` to all three session cookie configs

**Vercel serverless fns** (`albayaan-pro/api/`) — for when API server project is misconfigured:
- `api/auth/login.ts` — standalone: pg + bcryptjs + HMAC token creation
- `api/auth/logout.ts` — standalone: returns 200 (token is stateless)
- `api/auth/me.ts` — standalone: HMAC token verification + pg user lookup
- `api/storage/upload-url.ts` — standalone: HMAC admin auth + Supabase createSignedUploadUrl
- `api/storage/health.ts` — env var diagnostic, no auth

**Frontend** (`albayaan-pro/src/`):
- `adminFetch.ts` — `getAdminToken()` now checks localStorage first (`albayaan_admin_token`) before Supabase; exports `storeAdminToken()` and `clearAdminToken()`
- `AdminLogin.tsx` — stores `data.token` from login response in localStorage
- `AuthContext.tsx` — `setAuthTokenGetter` checks localStorage; `logout()` calls `clearAdminToken()`

**Why:**
Session cookies fail cross-origin (`albayaan.pro` → `albayaan-pro-api-server.vercel.app`) even with `sameSite:none` if the login endpoint returns 405. HMAC Bearer tokens stored in localStorage are origin-independent and work with any serverless function deployment.

**How to apply:**
- Production login stores token in localStorage → all adminFetch calls send `Authorization: Bearer <token>`
- For new admin routes: check Bearer token in `isAdminRequest()` (already handles custom HMAC as Path 2)
- Vercel env vars required on `albayaan-pro-api-server.vercel.app`: `DATABASE_URL`, `SESSION_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`

## Deployment Requirements

For production to work after code changes are deployed:
1. Deploy `albayaan-pro/` to `albayaan-pro-api-server.vercel.app` (or whichever project that URL belongs to)
2. Set env vars: `DATABASE_URL`, `SESSION_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
3. Optionally: deploy `artifacts/api-server/` to a SEPARATE Vercel project as the Express backend (vercel.json is already correct)

## Local Test Confirmation

- `POST /api/auth/login` → `{"role":"admin","token":"<115-char HMAC token>",...}` ✅
- `GET /api/auth/me` with Bearer → `{"id":1,"name":"Admin","email":"admin@ilmai.so","role":"admin",...}` ✅
- `POST /api/storage/upload-url` with Bearer → auth passes, 503 only because SUPABASE_SERVICE_ROLE_KEY not set locally ✅
