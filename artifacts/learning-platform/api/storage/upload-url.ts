import { createClient } from "@supabase/supabase-js";
import { createHmac } from "crypto";

// ── Auth: Upload Secret ─────────────────────────────────────────────────────
// Frontend sends X-Upload-Secret header when VITE_UPLOAD_SECRET is set at
// Vercel build time. Optional — Bearer token path works without it.

function checkUploadSecret(req: any): boolean {
  const secret = process.env.UPLOAD_SECRET;
  if (!secret) return false;
  const provided = req.headers["x-upload-secret"] as string | undefined;
  return Boolean(provided && provided === secret);
}

// ── Auth: HMAC Bearer token ─────────────────────────────────────────────────
// Stateless token from createAdminToken(). Requires SESSION_SECRET env var.
// Optional — Supabase JWT path works when SESSION_SECRET is not set.

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
// Verifies a Supabase access_token and confirms role="admin" via app_metadata.
// No DATABASE_URL or pg connection needed — uses SUPABASE_URL + SERVICE_ROLE_KEY.
// admin@ilmai.so has app_metadata.role="admin" set in Supabase Auth.

async function verifySupabaseJwt(token: string): Promise<boolean> {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "";
  if (!supabaseUrl || !serviceRoleKey) return false;
  const apiKey = anonKey || serviceRoleKey;

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: apiKey },
    });
    if (!res.ok) return false;
    const user = (await res.json()) as Record<string, any>;

    const metaRole = user?.app_metadata?.role ?? user?.user_metadata?.role;
    if (metaRole === "admin") return true;

    const userId: string | undefined = user?.id;
    if (!userId) return false;

    const adminRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users/${userId}`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
    );
    if (!adminRes.ok) return false;
    const adminUser = (await adminRes.json()) as Record<string, any>;
    return (
      adminUser?.app_metadata?.role === "admin" ||
      adminUser?.user_metadata?.role === "admin"
    );
  } catch {
    return false;
  }
}

// ── Auth: Bearer token dispatcher ───────────────────────────────────────────

async function verifyAdminBearer(authHeader: string | undefined): Promise<boolean> {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  // Fast path: HMAC token (stateless, no network call)
  if (verifyHmacToken(token)) return true;
  // Supabase JWT path (requires SUPABASE_URL + SERVICE_ROLE_KEY)
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

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!serviceRoleKey || !supabaseUrl) {
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
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
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
      : `${supabaseUrl}/storage/v1${data.signedUrl}`;

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;

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
