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

  const { email, password } = (req.body as Record<string, string>) ?? {};
  if (!email || !password) { res.status(400).json({ error: "Email and password are required" }); return; }

  try {
    await init();
    const { rows } = await getPool().query(
      `SELECT id, name, email, role, password_hash, created_at FROM users WHERE email = $1 LIMIT 1`,
      [String(email).toLowerCase().trim()]
    );
    const user = rows[0];
    if (!user) { res.status(401).json({ error: "Invalid credentials" }); return; }
    if (user.password_hash === "supabase-auth") {
      res.status(400).json({ error: "Please sign in with Supabase." }); return;
    }
    const valid = await bcrypt.compare(String(password), user.password_hash);
    if (!valid) { res.status(401).json({ error: "Invalid credentials" }); return; }

    const token = createToken(user.id, user.role);
    res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role, token, createdAt: user.created_at });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[auth/login]", msg);
    res.status(500).json({ error: "Internal server error" });
  }
}
