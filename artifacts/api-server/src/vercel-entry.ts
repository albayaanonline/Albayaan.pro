/**
 * Vercel serverless entry point.
 * Exports the Express app as default — Vercel wraps it automatically.
 * Does NOT start a TCP listener (no app.listen).
 */
import express, { type Express } from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import { pool } from "@workspace/db";
import ConnectPgSimple from "connect-pg-simple";

const PgSession = ConnectPgSimple(session);

const app: Express = express();

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

app.use("/api", router);

export default app;
