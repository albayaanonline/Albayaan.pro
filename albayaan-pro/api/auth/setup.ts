import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { createHmac } from "crypto";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret(): string {
  return process.env.SESSION_SECRET ?? "albayaan-secret-fallback";
}

function createToken(userId: number, role: string): string {
  const expires = Date.now() + TTL_MS;
  const payload = `${userId}:${role}:${expires}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

function setCors(req: VercelRequest, res: VercelResponse): void {
  const origin = (req.headers.origin as string | undefined) || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
}

/**
 * POST /api/auth/setup
 *
 * One-time admin account setup. Requires the ADMIN_ELEVATION_SECRET.
 * Creates the user if they don't exist, updates password if they do,
 * and sets role = 'admin'. Safe to call multiple times (idempotent).
 *
 * Body: { email, password, name, secret }
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { email, password, name, secret } = (req.body as Record<string, string>) ?? {};

  const adminSecret = process.env.ADMIN_ELEVATION_SECRET;
  if (!adminSecret || !secret || secret !== adminSecret) {
    res.status(403).json({ error: "Invalid or missing setup secret." });
    return;
  }

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const displayName = name || normalizedEmail.split("@")[0];

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const passwordHash = await bcrypt.hash(String(password), 10);

    const { rows } = await pool.query<{
      id: number; name: string; email: string; role: string; created_at: string;
    }>(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (email) DO UPDATE
         SET password_hash = EXCLUDED.password_hash,
             role = 'admin',
             name = EXCLUDED.name
       RETURNING id, name, email, role, created_at`,
      [displayName, normalizedEmail, passwordHash],
    );

    const user = rows[0];
    const token = createToken(user.id, "admin");

    res.status(200).json({
      success: true,
      message: "Admin account created/updated successfully.",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[auth/setup]", msg);
    res.status(500).json({ error: msg });
  }
}
