/**
 * Vercel serverless entry point.
 * Exports the Express app as default — Vercel wraps it automatically.
 * Does NOT start a TCP listener (no app.listen).
 *
 * Hardened against missing env vars:
 *  - DATABASE_URL missing → session store degrades to memory store, all routes
 *    that need DB return 503 with a clear JSON error (never HTML).
 *  - SESSION_SECRET missing → falls back to a fixed string (safe for stateless
 *    admin flows that use Supabase bearer tokens instead of sessions).
 */
import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";

const app: Express = express();

<<<<<<< HEAD
const corsOptions = {
  origin: true,
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-file-type",
    "x-filename",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
=======
// ── CORS ──────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-file-type",
      "x-filename",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
>>>>>>> 7a4fb55 (Fix upload errors by improving server stability and error handling)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

<<<<<<< HEAD
app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET ?? "albayaan-secret-fallback",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    },
  }),
);
=======
// ── Session store ──────────────────────────────────────────────────────────
// Use PostgreSQL-backed sessions when DATABASE_URL is available.
// Fall back to in-memory sessions otherwise so the server still starts.
if (process.env.DATABASE_URL) {
  try {
    const { pool } = await import("@workspace/db");
    const ConnectPgSimple = (await import("connect-pg-simple")).default;
    const PgSession = ConnectPgSimple(session);
>>>>>>> 7a4fb55 (Fix upload errors by improving server stability and error handling)

    app.use(
      session({
        store: new PgSession({
          pool,
          tableName: "user_sessions",
          createTableIfMissing: true,
        }),
        secret: process.env.SESSION_SECRET ?? "albayaan-secret-fallback",
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: true,
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
      }),
    );
  } catch (err: any) {
    console.error("[session] PgSession setup failed, using memory store:", err?.message);
    app.use(
      session({
        secret: process.env.SESSION_SECRET ?? "albayaan-secret-fallback",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true, httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 },
      }),
    );
  }
} else {
  console.warn("[session] DATABASE_URL not set — using in-memory session store.");
  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? "albayaan-secret-fallback",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: true, httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 },
    }),
  );
}

// ── Routes ─────────────────────────────────────────────────────────────────
app.use("/api", router);

// ── Global JSON error handler ───────────────────────────────────────────────
// Ensures ALL unhandled Express errors return JSON (never HTML).
// This catches errors thrown by route handlers, middleware, etc.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = typeof err?.status === "number" ? err.status : 500;
  const message = err?.message ?? "Internal server error";
  console.error("[error]", status, message, err?.stack ?? "");
  if (!res.headersSent) {
    res.status(status).json({ error: message });
  }
});

export default app;
