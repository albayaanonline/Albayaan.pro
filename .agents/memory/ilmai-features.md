---
name: Albayaan Feature Set
description: Auth system, admin panel, courses data, payment system, and AI chat capabilities.
---

## Auth System
- Email + Password ONLY via Express backend (removed Google OAuth / Firebase / Supabase OAuth)
- Backend: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/forgot-password`
- AuthContext: no Supabase/Firebase listeners; uses `useGetMe` hook + localStorage admin key `albayaan_admin_user`
- Login.tsx: clean premium design, no Google button, icons: Mail + Lock
- Register.tsx: Full Name + Email + Password + Confirm Password + password strength meter (5-bar)
- ForgotPassword.tsx at `/auth/forgot-password`: sends to `/api/auth/forgot-password`, shows success screen
- **Why:** User explicitly requested email-only auth; backend already had complete bcrypt+session auth

## Password Strength Meter
- 5-level: Weak / Fair / Good / Strong / Very Strong
- Checks: length >= 6, length >= 10, uppercase, digit, special char
- Visual: 5-segment colored bar (red → green)

## Admin Panel
- URL: `/admin/login` (default: admin@example.com / Admin123)
- Real backend: stats, courses CRUD, lessons CRUD, payments, codes, user list + DELETE, analytics
- `DELETE /admin/users/:userId` — real endpoint, prevents self-deletion
- AdminDashboard: 7 tabs (Overview, Courses, Users, Payments, Codes, Analytics, Certificates)
- Users tab: search by name/email, real delete with confirmation, stat cards
- Analytics tab: recharts BarChart (enrollments), PieChart (categories), BarChart (levels)

## Courses
- 18+ courses from `src/data/courses.ts` (local static data used by admin COURSES import)
- Also DB-backed via coursesTable for dynamic admin creation
- recharts is installed (`"recharts": "^2.15.2"`) and used in AdminDashboard analytics

## Certificate
- `generateCertId(userId, courseId)` → `ALBAYAAN-XXXX-XXXX-YYYY`
- PDF via html2canvas + jsPDF (lazy imported)
- Verification at `/verify/:certId`

## Payment
- Zaad / Waafi / card (Payment.tsx)
- Admin confirms payments at `/admin/payments`

## AI Chat
- Floating widget with intelligent local response engine
- Full AI Tutor page at `/ai-tutor`
