import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const BUCKET = "course-media";

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
    const user = await res.json();
    const role =
      user?.app_metadata?.role ?? user?.user_metadata?.role ?? "user";
    return role === "admin";
  } catch {
    return false;
  }
}

export default async function handler(req: any, res: any): Promise<void> {
  const origin = req.headers.origin ?? "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type"
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
    res.status(401).json({ error: "Unauthorized — admin token required" });
    return;
  }

  if (!SERVICE_ROLE_KEY || !SUPABASE_URL) {
    res.status(500).json({
      error: "Server misconfigured: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL is not set",
    });
    return;
  }

  const { filename, contentType } = req.body ?? {};
  if (!filename || !contentType) {
    res.status(400).json({ error: "filename and contentType are required" });
    return;
  }

  // Ensure bucket exists
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
  } catch { /* non-fatal */ }

  const folder = (contentType as string).startsWith("video/")
    ? "videos"
    : (contentType as string).startsWith("image/")
    ? "images"
    : "documents";
  const ext = (filename as string).split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // Use Supabase REST API to get signed upload URL
  // Returns { url: "/object/upload/sign/...", token: "..." }
  const signRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/upload/sign/${BUCKET}/${path}`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    }
  );

  if (!signRes.ok) {
    const body = await signRes.text().catch(() => "");
    res.status(500).json({
      error: `Failed to create signed upload URL (${signRes.status}): ${body}`,
    });
    return;
  }

  const data = await signRes.json();

  if (!data.url || !data.token) {
    res.status(500).json({
      error: `Unexpected Supabase response: ${JSON.stringify(data)}`,
    });
    return;
  }

  // Build the full PUT URL the client will use
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
