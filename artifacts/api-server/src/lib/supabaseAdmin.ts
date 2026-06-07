import { createClient } from "@supabase/supabase-js";
import ws from "ws";

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

// ── Runtime env readers (called at request time, never at module load) ────
function getSupabaseUrl(): string {
  return process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
}

function getServiceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
}

// ── On-demand admin client (reads env vars at call time) ──────────────────
function getSupabaseAdmin() {
  const url = getSupabaseUrl();
  const key = getServiceRoleKey();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    realtime: { transport: ws as any },
  });
}

// ── Startup diagnostics ───────────────────────────────────────────────────
export function logStorageConfig(): void {
  const url = getSupabaseUrl();
  const key = getServiceRoleKey();
  const urlOk = Boolean(url);
  const keyOk = Boolean(key);
  console.log(
    `[storage] SUPABASE_URL          : ${urlOk ? url : "❌ NOT SET"}`,
  );
  console.log(
    `[storage] SUPABASE_SERVICE_ROLE_KEY : ${keyOk ? "✅ set (" + key.slice(0, 8) + "...)" : "❌ NOT SET — uploads will fail"}`,
  );
  if (!urlOk || !keyOk) {
    console.error(
      "[storage] ⚠️  File uploads are disabled until both SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.",
    );
  }
}

// ── Auto-create all required buckets ─────────────────────────────────────
async function ensureAllBuckets(): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) return;

  const { data: existing, error: listErr } =
    await client.storage.listBuckets();

  if (listErr) {
    console.error("[storage] Failed to list buckets:", listErr.message);
    return;
  }

  const existingNames = new Set((existing ?? []).map((b) => b.name));

  for (const bucket of BUCKETS) {
    if (!existingNames.has(bucket)) {
      const { error } = await client.storage.createBucket(bucket, {
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

  const client = getSupabaseAdmin();
  if (!client) {
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
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getServiceRoleKey();

  if (!supabaseUrl) {
    throw new Error(
      "Supabase not configured: SUPABASE_URL (or VITE_SUPABASE_URL) is not set in environment variables.",
    );
  }
  if (!serviceRoleKey) {
    throw new Error(
      "Supabase not configured: SUPABASE_SERVICE_ROLE_KEY is not set in environment variables. Add it as a Replit secret.",
    );
  }

  const bucket = bucketForContentType(contentType);
  const ext = filename.split(".").pop()?.toLowerCase() ?? "bin";
  const objectPath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const signRes = await fetch(
    `${supabaseUrl}/storage/v1/object/upload/sign/${bucket}/${objectPath}`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
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

  if (!data.url) {
    throw new Error(
      `Unexpected Supabase response (missing url): ${JSON.stringify(data)}`,
    );
  }

  const signedUrl = data.url.startsWith("http")
    ? data.url
    : `${supabaseUrl}/storage/v1${data.url}`;

  const urlToken = new URL(signedUrl).searchParams.get("token") ?? data.token ?? "";

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;

  return { signedUrl, token: urlToken, path: objectPath, publicUrl, objectPath, bucket };
}

// ── Legacy server-side upload (buffers file in RAM) ───────────────────────
export async function uploadToSupabase(
  buffer: Buffer,
  contentType: string,
  filename?: string,
): Promise<string> {
  const supabaseUrl = getSupabaseUrl();
  const client = getSupabaseAdmin();

  if (!supabaseUrl) {
    throw new Error(
      "Supabase not configured: SUPABASE_URL (or VITE_SUPABASE_URL) is not set.",
    );
  }
  if (!client) {
    throw new Error(
      "Supabase not configured: SUPABASE_SERVICE_ROLE_KEY is not set. Add it as a Replit secret.",
    );
  }

  const bucket = bucketForContentType(contentType);
  const ext = filename?.split(".").pop()?.toLowerCase() ?? "bin";
  const objectPath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await client.storage
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
  } = client.storage.from(bucket).getPublicUrl(data.path);

  return publicUrl;
}
