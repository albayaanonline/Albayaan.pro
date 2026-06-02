import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// ── Bucket names requested by the platform ────────────────────────────────
const BUCKETS = ["videos", "thumbnails", "documents", "certificates"] as const;
type BucketName = (typeof BUCKETS)[number];

// Map content-type → bucket
function bucketForContentType(contentType: string): BucketName {
  if (contentType.startsWith("video/")) return "videos";
  if (contentType.startsWith("image/")) return "thumbnails";
  if (
    contentType === "application/pdf" ||
    contentType.startsWith("application/msword") ||
    contentType.startsWith(
      "application/vnd.openxmlformats-officedocument.wordprocessingml",
    ) ||
    contentType.startsWith("text/")
  )
    return "documents";
  return "documents";
}

// ── Singleton admin client ─────────────────────────────────────────────────
// Node 20 lacks native WebSocket; pass the "ws" package as transport so
// @supabase/realtime-js does not throw at startup.
export const supabaseAdmin =
  SUPABASE_URL && SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
        realtime: { transport: ws as any },
      })
    : null;

// ── Startup diagnostics ───────────────────────────────────────────────────
export function logStorageConfig(): void {
  const urlOk = Boolean(SUPABASE_URL);
  const keyOk = Boolean(SERVICE_ROLE_KEY);
  console.log(
    `[storage] SUPABASE_URL          : ${urlOk ? SUPABASE_URL : "❌ NOT SET"}`,
  );
  console.log(
    `[storage] SUPABASE_SERVICE_ROLE_KEY : ${keyOk ? "✅ set (" + SERVICE_ROLE_KEY.slice(0, 8) + "...)" : "❌ NOT SET — uploads will fail"}`,
  );
  if (!urlOk || !keyOk) {
    console.error(
      "[storage] ⚠️  File uploads are disabled until both SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.",
    );
  }
}

// ── Auto-create all required buckets ─────────────────────────────────────
async function ensureAllBuckets(): Promise<void> {
  if (!supabaseAdmin) return;

  const { data: existing, error: listErr } =
    await supabaseAdmin.storage.listBuckets();

  if (listErr) {
    console.error("[storage] Failed to list buckets:", listErr.message);
    return;
  }

  const existingNames = new Set((existing ?? []).map((b) => b.name));

  for (const bucket of BUCKETS) {
    if (!existingNames.has(bucket)) {
      const { error } = await supabaseAdmin.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: null,
        allowedMimeTypes: null,
      });
      if (error) {
        console.error(`[storage] Failed to create bucket '${bucket}':`, error.message);
      } else {
        console.log(`[storage] ✅ Created bucket: ${bucket}`);
      }
    } else {
      console.log(`[storage] ✅ Bucket exists: ${bucket}`);
    }
  }
}

export async function ensureStorageBucket(): Promise<void> {
  logStorageConfig();

  if (!supabaseAdmin) {
    console.warn(
      "[storage] Skipping bucket setup — Supabase admin client not initialised.",
    );
    return;
  }

  await ensureAllBuckets();
  console.log("[storage] Bucket initialisation complete.");
}

// ── Signed upload URL (client uploads directly to Supabase) ──────────────
export async function createSignedUploadUrl(
  filename: string,
  contentType: string,
): Promise<{
  signedUrl: string;
  token: string;
  path: string;
  publicUrl: string;
  objectPath: string;
  bucket: string;
}> {
  if (!SUPABASE_URL) {
    throw new Error(
      "Supabase not configured: SUPABASE_URL (or VITE_SUPABASE_URL) is not set in environment variables.",
    );
  }
  if (!SERVICE_ROLE_KEY) {
    throw new Error(
      "Supabase not configured: SUPABASE_SERVICE_ROLE_KEY is not set in environment variables. Add it as a Replit secret.",
    );
  }

  const bucket = bucketForContentType(contentType);
  const ext = filename.split(".").pop()?.toLowerCase() ?? "bin";
  const objectPath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const signRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/upload/sign/${bucket}/${objectPath}`,
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
    throw new Error(
      `Supabase sign-URL request failed (HTTP ${signRes.status}) for bucket '${bucket}': ${body}`,
    );
  }

  const data = (await signRes.json()) as { url?: string; token?: string };

  if (!data.url || !data.token) {
    throw new Error(
      `Unexpected Supabase response (missing url/token): ${JSON.stringify(data)}`,
    );
  }

  const signedUrl = `${SUPABASE_URL}/storage/v1${data.url}`;
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${objectPath}`;

  return { signedUrl, token: data.token, path: objectPath, publicUrl, objectPath, bucket };
}

// ── Legacy server-side upload (buffers file in RAM) ───────────────────────
export async function uploadToSupabase(
  buffer: Buffer,
  contentType: string,
  filename?: string,
): Promise<string> {
  if (!SUPABASE_URL) {
    throw new Error(
      "Supabase not configured: SUPABASE_URL (or VITE_SUPABASE_URL) is not set.",
    );
  }
  if (!supabaseAdmin) {
    throw new Error(
      "Supabase not configured: SUPABASE_SERVICE_ROLE_KEY is not set. Add it as a Replit secret.",
    );
  }

  const bucket = bucketForContentType(contentType);
  const ext = filename?.split(".").pop()?.toLowerCase() ?? "bin";
  const objectPath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(objectPath, buffer, {
      contentType,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    throw new Error(
      `Supabase Storage upload failed for bucket '${bucket}': ${error.message}`,
    );
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path);

  return publicUrl;
}
