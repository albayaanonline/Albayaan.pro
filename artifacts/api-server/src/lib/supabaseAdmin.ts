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

export async function ensureStorageBucket(): Promise<void> {
  if (!supabaseAdmin) {
    console.warn(
      "[storage] SUPABASE_SERVICE_ROLE_KEY is not set — file uploads via the backend will fail. " +
        "Add it to your API server environment variables.",
    );
    return;
  }
  try {
    const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
    if (error) {
      console.warn("[storage] Could not list buckets:", error.message);
      return;
    }
    if (!buckets?.some((b) => b.name === BUCKET)) {
      const { error: createErr } = await supabaseAdmin.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: null,
        allowedMimeTypes: null,
      });
      if (createErr) {
        console.warn("[storage] Could not create bucket:", createErr.message);
      } else {
        console.log(`[storage] Created Supabase Storage bucket: ${BUCKET}`);
      }
    } else {
      console.log(`[storage] Bucket '${BUCKET}' is ready.`);
    }
  } catch (err) {
    console.warn("[storage] Bucket initialization failed:", err);
  }
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
