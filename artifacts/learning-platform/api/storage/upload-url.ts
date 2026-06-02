import { createClient } from "@supabase/supabase-js";
import { Pool } from "pg";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const DATABASE_URL = process.env.DATABASE_URL ?? "";
const BUCKET = "course-media";

/**
 * Verify the Bearer token belongs to an admin user.
 * Fast path: check Supabase app_metadata.role.
 * Fallback: query the local PostgreSQL users table by email — this handles
 * admins whose role lives only in the local DB (not in Supabase metadata).
 */
async function verifyAdmin(authHeader: string | undefined): Promise<boolean> {
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

    // Fast path: Supabase metadata has the role
    const metaRole = user?.app_metadata?.role ?? user?.user_metadata?.role;
    if (metaRole === "admin") return true;

    // Fallback: look up in local PostgreSQL users table by email
    const email: string | undefined = user?.email;
    if (!email || !DATABASE_URL) return false;

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

export default async function handler(req: any, res: any): Promise<void> {
  // Reflect the exact request origin — required for credentials: "include" mode.
  // Never use "*" here: wildcard + credentials is rejected by all browsers.
  const origin = req.headers.origin ?? "";
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type",
  );

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const isAdmin = await verifyAdmin(req.headers.authorization);
  if (!isAdmin) {
    res.status(401).json({ error: "Unauthorized — admin login required" });
    return;
  }

  if (!SERVICE_ROLE_KEY || !SUPABASE_URL) {
    res.status(500).json({
      error:
        "Server misconfigured: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL is not set on this deployment",
    });
    return;
  }

  const { filename, contentType } = req.body ?? {};
  if (!filename || !contentType) {
    res.status(400).json({ error: "filename and contentType are required" });
    return;
  }

  // Ensure bucket exists (non-fatal if it already exists)
  try {
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.some((b: any) => b.name === BUCKET)) {
      await supabaseAdmin.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: null,
        allowedMimeTypes: null,
      });
    }
  } catch {
    /* non-fatal: bucket may already exist */
  }

  const folder = (contentType as string).startsWith("video/")
    ? "videos"
    : (contentType as string).startsWith("image/")
      ? "images"
      : "documents";
  const ext = (filename as string).split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // Request a signed upload URL from Supabase Storage
  const signRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/upload/sign/${BUCKET}/${path}`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    },
  );

  if (!signRes.ok) {
    const body = await signRes.text().catch(() => "");
    res.status(500).json({
      error: `Failed to create signed upload URL (${signRes.status}): ${body}`,
    });
    return;
  }

  let data: any;
  try {
    data = await signRes.json();
  } catch {
    res.status(500).json({ error: "Supabase returned an unexpected response" });
    return;
  }

  if (!data.url || !data.token) {
    res.status(500).json({
      error: `Unexpected Supabase response: ${JSON.stringify(data)}`,
    });
    return;
  }

  const signedUrl = `${SUPABASE_URL}/storage/v1${data.url}`;
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

  res.json({
    signedUrl,
    token: data.token,
    path,
    publicUrl,
    objectPath: path,
  });
}
