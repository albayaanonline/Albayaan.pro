---
name: Albayaan Auth Flow
description: Full authentication flow from Supabase to backend DB sync and RBAC.
---

## Flow
1. Frontend calls `supabase.auth.signInWithPassword` (or register, OAuth)
2. `onAuthStateChange` fires with session on `SIGNED_IN`/`INITIAL_SESSION`
3. `syncWithBackend(accessToken)` — POST to `/api/auth/session-from-supabase` with Bearer token
4. Backend: `verifySupabaseToken(token)` calls `${SUPABASE_URL}/auth/v1/user` with `apikey` header
5. Backend finds/creates user in local `users` table, returns `{ id, name, email, role, supabaseId }`
6. Frontend stores user in AuthContext state

## RBAC (ProtectedRoute)
- Non-logged-in user → redirect to `/auth/login` (or `/admin/login` for admin routes)
- Logged-in non-admin accessing `/admin/*` → toast "Access Denied" + redirect to `/`
- Admin accessing `/admin/*` → allowed through

## Env Vars Required
- `VITE_SUPABASE_URL` — used on both frontend AND backend (auth middleware reads it)
- `VITE_SUPABASE_ANON_KEY` — same
- `SESSION_SECRET` — for express-session (fallback: "ilmai-secret-fallback")
- `DATABASE_URL` — PostgreSQL connection string

## Auth Callback
`/auth/callback` route exists in App.tsx and points to `AuthCallback.tsx`. Handles OAuth redirects by calling `supabase.auth.getSession()` then redirecting to `/dashboard`.

## Password Reset
`/auth/forgot-password` — detects recovery mode via `window.location.hash.includes("type=recovery")`. In recovery mode, shows new password form using `supabase.auth.updateUser({ password })`.

**Why:** Supabase sends password reset links with `#type=recovery` in the URL fragment. The hash-based detection is correct for this flow since the router doesn't see URL fragments.
