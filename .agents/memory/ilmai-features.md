---
name: Albayaan Feature Set
description: Current feature state of the Albayaan.pro LMS platform after Supabase auth + real DB upgrade.
---

## Auth System
- Supabase email/password auth (Login.tsx, Register.tsx, ForgotPassword.tsx, AdminLogin.tsx)
- AuthContext.tsx: onAuthStateChange → POST /api/auth/session-from-supabase → syncs with Replit PostgreSQL users table
- Role stored in users.role DB column. Admin promotion: POST /api/admin/elevate with ADMIN_ELEVATION_SECRET env var
- `isSupabaseConfigured` guard in supabase.ts — if VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY not set, auth disabled gracefully
- AdminLogin.tsx also uses Supabase signIn then verifies admin role via /api/auth/me

## Password Strength Meter
- 5-level: Weak / Fair / Good / Strong / Very Strong
- Visual: 5-segment colored bar (red → green)

## Admin Panel
- URL: `/admin/login` (default creds stored in DB, promoted via /api/admin/elevate)
- AdminDashboard: 7 tabs (Overview, Courses, Users, Payments, Codes, Analytics, Certificates)
- All tabs use real API data from /api/admin/courses — no static COURSES import
- editingCourse/deletingCourse/expandedLesson: number|null (API course id is numeric)
- Users tab: search by name/email, real delete with confirmation, stat cards

## Courses Data
- DB-backed via coursesTable (Drizzle + Replit PostgreSQL)
- src/data/courses.ts still exists (legacy) but NOT used in AdminDashboard anymore
- Course API fields: id (number), title, titleAr, language, level, price, enrolledCount, lessonCount, duration, description
- recharts installed (`"recharts": "^2.15.2"`) for analytics charts

## Certificates
- DB table: certificatesTable in lib/db/src/schema/certificates.ts (migration applied)
- Fields: certId, userId, courseId, studentName, courseName, issuedAt
- API: GET /api/certificates/:certId, POST /api/certificates
- Certificate.tsx persists to DB on mount; Verify.tsx looks up by certId from DB

## Cinematic UI
- Dark theme: background #020617, blue #2563EB, purple #7C3AED
- Poppins font, framer-motion animations, particle orbs
- Framer Motion v12: custom variant functions must be typed `as any`

## Payment
- Zaad / Waafi / card options in Payment.tsx (UI only — gateway integration pending)

## API Server
- Port 8080. Vite proxy: /api → http://localhost:${API_SERVER_PORT ?? 8080}
- Key routes: /api/auth/session-from-supabase, /api/auth/me, /api/admin/elevate
- requireAdmin middleware: async, checks users.role in DB via Bearer token

## Env vars needed
- VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (frontend Vite)
- SUPABASE_SERVICE_ROLE_KEY (api-server token verification)
- ADMIN_ELEVATION_SECRET (api-server admin promotion)
- DATABASE_URL (Replit PostgreSQL, auto-set)
