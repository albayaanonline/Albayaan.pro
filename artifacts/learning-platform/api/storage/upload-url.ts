import { createClient } from "@supabase/supabase-js";
import { createHmac } from "crypto";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// ── Auth: Upload Secret ─────────────────────────────────────────────────────
// Frontend sends X-Upload-Secret header (when VITE_UPLOAD_SECRET is set).

function checkUploadSecret(req: any): boolean {
  const secret = process.env.UPLOAD_SECRET;
  if (!secret) return false;
  const provided = req.headers["x-upload-secret"] as string | undefined;
  return Boolean(provided && provided === secret);
}

// ── Auth: HMAC Bearer token ─────────────────────────────────────────────────
// Stateless HMAC-SHA256 token created by createAdminToken() on the API server.
// Format (base64url): userId:role:expiresMs:hmacHex
// Signed with SESSION_SECRET — must be set as env var on this deployment.

function verifyHmacToken(token: string): boolean {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon === -1) return false;
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    if (sig !== expected) return false;
    const parts = payload.split(":");
    if (parts.length < 3) return false;
    const role = parts.slice(1, -1).join(":");
    const expiresStr = parts[parts.length - 1];
    if (Date.now() > parseInt(expiresStr, 10)) return false;
    return role === "admin";
  } catch {
    return false;
  }
}

// ── Auth: Supabase JWT Bearer token ─────────────────────────────────────────
// Accepts a Supabase access token and checks role via metadata or local DB.

async function verifySupabaseJwt(token: string): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_ANON_KEY,
      },
    });
    if (!res.ok) return false;
    const user = (await res.json()) as Record<string, any>;

    const metaRole = user?.app_metadata?.role ?? user?.user_metadata?.role;
    if (metaRole === "admin") return true;

    const DATABASE_URL = process.env.DATABASE_URL ?? "";
    const email: string | undefined = user?.email;
    if (!email || !DATABASE_URL) return false;

    const { Pool } = await import("pg");
    const pg = new Pool({ connectionString: DATABASE_URL, max: 1 });
    try {
      const result = await pg.query<{ role: string }>(
        "SELECT role FROM users WHERE email = $1 LIMIT 1",
        [email],
      );
      return result.rows[0]?.role === "admin";
    } finally {
      await pg.end();
    }
  } catch {
    return false;
  }
}

// ── Auth: Bearer token dispatcher ───────────────────────────────────────────

async function verifyAdminBearer(authHeader: string | undefined): Promise<boolean> {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  // Fast path: HMAC token (no network call)
  if (verifyHmacToken(token)) return true;
  // Fallback: Supabase JWT
  return verifySupabaseJwt(token);
}

// ── Bucket routing ──────────────────────────────────────────────────────────

function bucketForContentType(contentType: string): string {
  if (contentType.startsWith("video/")) return "videos";
  if (contentType.startsWith("image/")) return "thumbnails";
  return "documents";
}

// ── CORS ────────────────────────────────────────────────────────────────────

function setCors(req: any, res: any): void {
  const origin = (req.headers.origin as string | undefined) ?? "";
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type, X-Upload-Secret",
  );
}

// ── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req: any, res: any): Promise<void> {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  // Accept upload secret OR admin Bearer token (HMAC or Supabase JWT)
  const authed =
    checkUploadSecret(req) ||
    (await verifyAdminBearer(req.headers.authorization));

  if (!authed) {
    res.status(401).json({
      error: "Unauthorized — provide X-Upload-Secret header or an admin Bearer token",
    });
    return;
  }

  if (!SERVICE_ROLE_KEY || !SUPABASE_URL) {
    res.status(503).json({
      error: "Storage not configured: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set",
    });
    return;
  }

  const { filename, contentType } = (req.body as Record<string, string>) ?? {};
  if (!filename || !contentType) {
    res.status(400).json({ error: "filename and contentType are required" });
    return;
  }

  const bucket = bucketForContentType(contentType);
  const ext = filename.split(".").pop()?.toLowerCase() ?? "bin";
  const objectPath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(objectPath);

    if (error || !data) {
      res.status(500).json({
        error: error?.message ?? "Failed to create signed upload URL",
      });
      return;
    }

    const fullSignedUrl = data.signedUrl.startsWith("http")
      ? data.signedUrl
      : `${SUPABASE_URL}/storage/v1${data.signedUrl}`;

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${objectPath}`;

    res.status(200).json({
      signedUrl: fullSignedUrl,
      path: objectPath,
      objectPath,
      publicUrl,
      bucket,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[storage/upload-url]", msg);
    res.status(500).json({ error: msg });
  }
}
