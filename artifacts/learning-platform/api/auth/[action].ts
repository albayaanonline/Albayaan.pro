import { getPool, setCors, ensureSchema, seedIfEmpty } from "../_db";
import bcrypt from "bcryptjs";
import { createHmac } from "crypto";
import { randomBytes } from "crypto";

const TTL_MS = 7 * 24 * 60 * 60 * 1000;

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

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

function verifyToken(token: string): { userId: number; role: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon === -1) return null;
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);
    const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");
    if (sig !== expected) return null;
    const parts = payload.split(":");
    if (parts.length < 3) return null;
    const expiresStr = parts[parts.length - 1];
    const role = parts.slice(1, -1).join(":");
    if (Date.now() > parseInt(expiresStr, 10)) return null;
    const userId = parseInt(parts[0], 10);
    if (isNaN(userId)) return null;
    return { userId, role };
  } catch {
    return null;
  }
}

async function handleLogin(req: any, res: any): Promise<void> {
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
    if (user.password_hash === "supabase-auth") { res.status(400).json({ error: "Please sign in with Supabase." }); return; }
    const valid = await bcrypt.compare(String(password), user.password_hash);
    if (!valid) { res.status(401).json({ error: "Invalid credentials" }); return; }
    const token = createToken(user.id, user.role);
    res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role, token, createdAt: user.created_at });
  } catch (err: unknown) {
    console.error("[auth/login]", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "Internal server error" });
  }
}

function handleLogout(_req: any, res: any): void {
  res.status(200).json({ ok: true });
}

async function handleMe(req: any, res: any): Promise<void> {
  const auth = req.headers.authorization as string | undefined;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) { res.status(401).json({ error: "Unauthorized" }); return; }
  const claims = verifyToken(token);
  if (!claims) { res.status(401).json({ error: "Invalid or expired token" }); return; }
  try {
    await ensureSchema(getPool());
    const { rows } = await getPool().query(
      `SELECT id, name, email, role, created_at FROM users WHERE id = $1 LIMIT 1`,
      [claims.userId]
    );
    const user = rows[0];
    if (!user) { res.status(401).json({ error: "User not found" }); return; }
    res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.created_at });
  } catch (err: unknown) {
    console.error("[auth/me]", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function handleRegister(req: any, res: any): Promise<void> {
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
  const { name, email, password } = (req.body as Record<string, string>) ?? {};
  if (!name || !email || !password) { res.status(400).json({ error: "Name, email and password are required" }); return; }
  if (password.length < 6) { res.status(400).json({ error: "Password must be at least 6 characters" }); return; }
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
    console.error("[auth/register]", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function handleSessionFromSupabase(req: any, res: any): Promise<void> {
  if (req.method !== "POST") { res.status(405).json({ error: "Method Not Allowed" }); return; }
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) { res.status(503).json({ error: "Auth service not configured" }); return; }
  const authHeader = req.headers.authorization as string | undefined;
  if (!authHeader?.startsWith("Bearer ")) { res.status(401).json({ error: "Missing Bearer token" }); return; }
  const token = authHeader.slice(7);
  const apiKey = SUPABASE_ANON_KEY || SERVICE_ROLE_KEY;
  try {
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: apiKey },
    });
    if (!userRes.ok) { res.status(401).json({ error: "Invalid or expired Supabase token" }); return; }
    const user = (await userRes.json()) as Record<string, any>;
    if (!user?.id || !user?.email) { res.status(401).json({ error: "Could not retrieve user from token" }); return; }
    let role: "admin" | "user" =
      user?.app_metadata?.role === "admin" || user?.user_metadata?.role === "admin" ? "admin" : "user";
    if (role !== "admin") {
      const adminRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
        headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
      });
      if (adminRes.ok) {
        const adminUser = (await adminRes.json()) as Record<string, any>;
        if (adminUser?.app_metadata?.role === "admin" || adminUser?.user_metadata?.role === "admin") {
          role = "admin";
        }
      }
    }
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user.email.split("@")[0];
    res.status(200).json({ id: user.id, supabaseId: user.id, email: user.email, name, role });
  } catch (err: unknown) {
    console.error("[auth/session-from-supabase]", err instanceof Error ? err.message : err);
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}

export default async function handler(req: any, res: any): Promise<void> {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }

  const action = req.query.action as string;

  switch (action) {
    case "login":                 return handleLogin(req, res);
    case "logout":                return handleLogout(req, res);
    case "me":                    return handleMe(req, res);
    case "register":              return handleRegister(req, res);
    case "session-from-supabase": return handleSessionFromSupabase(req, res);
    default:                      res.status(404).json({ error: "Not found" }); return;
  }
}
