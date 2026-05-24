# IlmAI — AI Learning Platform

A premium futuristic online learning platform for English and Arabic language courses, built for Somali users with support for English, Arabic, and Somali (EN/AR/SO).

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080/5000)
- `pnpm --filter @workspace/learning-platform run dev` — run the frontend (port 19688)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — express-session secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, wouter, framer-motion, TailwindCSS, glassmorphism dark theme
- API: Express 5 with express-session + connect-pg-simple
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod schemas
- `lib/db/src/schema/` — Drizzle ORM schemas (users, courses, lessons, quizzes, progress, codes, payments, testimonials)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/learning-platform/src/pages/` — React pages
- `artifacts/learning-platform/src/lib/contexts/` — Auth + Language contexts

## Architecture decisions

- Contract-first API: OpenAPI spec → codegen → typed hooks + Zod validation on both server and client
- Session-based auth (express-session + bcryptjs) stored in PostgreSQL via connect-pg-simple
- Manual payment system: students pay via EVC Plus/Somtel/E-pir, admin confirms and generates access codes
- Access code system: admin generates codes; students redeem to unlock courses
- Multi-language: all user-facing content has EN/AR/SO variants stored in DB

## Product

- **Landing page**: Premium dark hero with animated gradients
- **Courses page**: English Language Course ($25, 5 lessons, 12h) + Arabic Language Course ($25, 5 lessons, 10h)
- **Course Detail**: Lesson list with lock/unlock state, enrollment CTA
- **Learn page**: Lesson content viewer + quiz (MCQ) with score
- **Auth**: Login / Register with glassmorphism cards
- **Payment page**: Choose EVC Plus (+252 61 2035767), Somtel (+252 65 6042512), or E-pir (0979695586); submit WhatsApp number
- **Access Code page**: Redeem code with payment numbers shown
- **Dashboard**: Student progress, enrolled courses, completion %
- **Admin Dashboard**: Stats, user list, payment confirmation (with code generation), access code management
- **AI Chat**: Floating AI assistant button (bottom-left)
- **WhatsApp button**: Bottom-right green floating button (+252 65 6042512)

## Credentials

- Admin: `admin@ilmai.so` / `admin123`
- Student demo: `axmed@example.com` / `admin123`
- Demo codes: `ENGLISH-FREE` (English), `ARABIC-FREE` (Arabic), `DEMO2024` (English)

## User preferences

- Premium futuristic dark glassmorphism UI (deep navy #050816, neon blue/purple)
- Multi-language: English, Arabic (RTL), Somali
- Somali payment providers: EVC Plus, Somtel, E-pir
- WhatsApp contact: +252 65 6042512

## Gotchas

- Lessons must be seeded with correct `course_id` referencing the `courses` table
- `useGetUserProgress` returns `percentComplete` (not `progressPercent`)
- `SubmitPaymentBody` requires `whatsappNumber` (not `phone`)
- Admin stats returns `totalCodes` + `usedCodes` (no direct `activeCodes` field)
- The LanguageToggle and ThemeToggle components live in `shared/` not `layout/`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
