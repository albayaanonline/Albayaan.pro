---
name: Albayaan API URL Routing
description: How to correctly route API calls in dev vs Vercel production; use resolveApiUrl/adminFetch everywhere.
---

All fetch calls to the Express API server must use `resolveApiUrl()` (exported from `src/lib/adminFetch.ts`) or `adminFetch()` — never bare relative paths like `/api/auth/logout`.

**Why:** In Vercel production, only `api/storage/upload-url.ts` exists as a serverless function. Every other `/api/*` relative URL would hit the Vercel catch-all rewrite → return `index.html` → break JSON parsing. In dev, Vite proxy (`/api → localhost:8080`) handles relative paths fine, but `resolveApiUrl()` returns the relative path unchanged when `VITE_API_BASE_URL` is not set, so it is safe in both environments.

**How to apply:**
- `FileUploader.tsx`, `MediaUrlInput.tsx`: use `adminFetch("/api/storage/upload-url", ...)` (handles token + URL)
- `AuthContext.tsx` (`syncWithBackend`, `logout`): use `resolveApiUrl("/api/auth/...")` 
- `AdminLogin.tsx` (`session-from-supabase` call): use `resolveApiUrl("/api/auth/session-from-supabase")`
- Any new admin fetch: prefer `adminFetch()` which bundles token + URL resolution

**Logout fix:** `setUser(null)` must come FIRST (optimistic) so the UI clears immediately, then do `fetch(logout)` and `supabase.auth.signOut()` async.

**Session destroy:** `req.session.destroy()` callback must contain the `res.json()` call, not be fire-and-forget. Also call `res.clearCookie("connect.sid")` before destroy.

**lucide-react icon safety:** lucide-react 0.545.0 has no `exports` field. With `"moduleResolution": "NodeNext"` TypeScript can't resolve named exports. Use `"moduleResolution": "bundler"` (same as main app tsconfig) for the `api/tsconfig.json` to avoid this. Stable icon replacements: `QrCode` → `ScanQrCode`, `UserCog` → `Settings`.
