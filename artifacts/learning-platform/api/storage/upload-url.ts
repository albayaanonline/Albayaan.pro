import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// ── Auth: Upload Secret (primary) ───────────────────────────────────────────
// Independent of admin session. Frontend sends X-Upload-Secret header.
// Set UPLOAD_SECRET env var on the Vercel deployment.

function checkUploadSecret(req: any): boolean {
  const secret = process.env.UPLOAD_SECRET;
  if (!secret) return false;
  const provided = req.headers["x-upload-secret"] as string | undefined;
  return provided === secret;
}

// ── Auth: Bearer admin token (fallback) ────────────────────────────────────
// Accepts a Supabase JWT or HMAC admin token in the Authorization header.
// Used when the caller is logged in as admin and passes a Bearer token.

async function verifyAdminBearer(authHeader: string | undefined): Promise<boolean> {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
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

    // Fallback: check local DB role via pg if DATABASE_URL is set
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

// ── Bucket routing ──────────────────────────────────────────────────────────
// Routes to the existing Supabase Storage buckets by content type.

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

  // Auth: accept upload secret OR admin Bearer token
  const uploadSecretOk = checkUploadSecret(req);
  const bearerOk = uploadSecretOk
    ? true
    : await verifyAdminBearer(req.headers.authorization);

  if (!uploadSecretOk && !bearerOk) {
    res.status(401).json({
      error:
        "Unauthorized — provide X-Upload-Secret header or an admin Bearer token",
    });
    return;
  }

  if (!SERVICE_ROLE_KEY || !SUPABASE_URL) {
    res.status(503).json({
      error:
        "Storage not configured: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set on this deployment",
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
