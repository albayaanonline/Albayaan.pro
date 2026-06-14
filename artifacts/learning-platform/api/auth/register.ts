import { getPool, setCors, ensureSchema, seedIfEmpty } from "../_db";
import bcrypt from "bcryptjs";
import { createHmac } from "crypto";

const TTL_MS = 7 * 24 * 60 * 60 * 1000;

let initialized = false;
async function init() {
  if (initialized) return;
  const p = getPool();
  await ensureSchema(p);
  await seedIfEmpty(p);
  initialized = true;
}

function getSecret(): string {
  return process.env.SESSION_SECRET ?? "albayaan-secret-fallback";
}

function createToken(userId: number, role: string): string {
  const expires = Date.now() + TTL_MS;
  const payload = `${userId}:${role}:${expires}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export default async function handler(req: any, res: any): Promise<void> {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  const { name, email, password } = (req.body as Record<string, string>) ?? {};
  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email and password are required" }); return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" }); return;
  }

  try {
    await init();
    const p = getPool();
    const { rows: existing } = await p.query(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [String(email).toLowerCase().trim()]);
    if (existing.length > 0) { res.status(400).json({ error: "Email already in use" }); return; }

    const hash = await bcrypt.hash(String(password), 10);
    const { rows } = await p.query(
      `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'user') RETURNING id, name, email, role, created_at`,
      [String(name).trim(), String(email).toLowerCase().trim(), hash]
    );
    const user = rows[0];
    const token = createToken(user.id, user.role);
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role, token, createdAt: user.created_at });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[auth/register]", msg);
    res.status(500).json({ error: "Internal server error" });
  }
}
