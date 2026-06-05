import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";
import { createHmac } from "crypto";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function getSecret(): string {
  return process.env.SESSION_SECRET ?? "albayaan-secret-fallback";
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

function setCors(req: VercelRequest, res: VercelResponse): void {
  const origin = (req.headers.origin as string | undefined) || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(200).end(); return; }

  const auth = req.headers.authorization as string | undefined;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const claims = verifyToken(token);
  if (!claims) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  try {
    const { rows } = await pool.query<{
      id: number;
      name: string;
      email: string;
      role: string;
      created_at: string;
    }>(
      `SELECT id, name, email, role, created_at FROM users WHERE id = $1 LIMIT 1`,
      [claims.userId],
    );
    const user = rows[0];
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[auth/me]", msg);
    res.status(500).json({ error: "Internal server error" });
  }
}
