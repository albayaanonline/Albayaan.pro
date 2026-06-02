import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const BUCKET = "course-media";

export const supabaseAdmin =
  SUPABASE_URL && SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

async function ensureBucket(): Promise<void> {
  if (!supabaseAdmin) return;
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.some((b) => b.name === BUCKET)) {
      await supabaseAdmin.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: null,
        allowedMimeTypes: null,
      });
      console.log(`[storage] Created bucket: ${BUCKET}`);
    }
  } catch { /* non-fatal */ }
}

export async function ensureStorageBucket(): Promise<void> {
  if (!supabaseAdmin) {
    console.warn(
      "[storage] SUPABASE_SERVICE_ROLE_KEY is not set — file uploads will fail.",
    );
    return;
  }
  await ensureBucket();
  console.log(`[storage] Bucket '${BUCKET}' is ready.`);
}

/**
 * Creates a Supabase signed upload URL so the client can PUT the file
 * directly to Supabase Storage — bypassing the server entirely.
 * Works for any file size (no Vercel 4.5 MB function body limit).
 *
 * The Supabase REST API returns { url, token } where:
 *   url  = relative path  e.g. /object/upload/sign/course-media/videos/xxx.mp4?token=...
 *   token = the raw JWT
 *
 * The client must PUT to: ${SUPABASE_URL}/storage/v1${url}
 * with Content-Type set to the file's MIME type.
 */
export async function createSignedUploadUrl(
  filename: string,
  contentType: string,
): Promise<{
  signedUrl: string;   // full PUT URL (SUPABASE_URL/storage/v1/object/upload/sign/...)
  token: string;
  path: string;
  publicUrl: string;
  objectPath: string;
}> {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error(
      "Supabase not configured: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.",
    );
  }

  const folder = contentType.startsWith("video/")
    ? "videos"
    : contentType.startsWith("image/")
      ? "images"
      : "documents";

  const ext = filename.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // Use Supabase REST API directly — same as what the JS SDK calls internally
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/upload/sign/${BUCKET}/${path}`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to create signed upload URL (${res.status}): ${body}`);
  }

  const data = (await res.json()) as { url?: string; token?: string };

  if (!data.url || !data.token) {
    throw new Error(`Unexpected Supabase response: ${JSON.stringify(data)}`);
  }

  // Build the full PUT URL the client will use
  const signedUrl = `${SUPABASE_URL}/storage/v1${data.url}`;
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

  return {
    signedUrl,
    token: data.token,
    path,
    publicUrl,
    objectPath: path,
  };
}

export async function uploadToSupabase(
  buffer: Buffer,
  contentType: string,
  filename?: string,
): Promise<string> {
  if (!supabaseAdmin) {
    throw new Error(
      "Supabase admin not configured. Add SUPABASE_SERVICE_ROLE_KEY to the API server environment.",
    );
  }

  const folder = contentType.startsWith("video/")
    ? "videos"
    : contentType.startsWith("image/")
      ? "images"
      : "documents";

  const ext = filename?.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabaseAdmin.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) throw new Error(`Supabase Storage upload failed: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(data.path);

  return publicUrl;
}
