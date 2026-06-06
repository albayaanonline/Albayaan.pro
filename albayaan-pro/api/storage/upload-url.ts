import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// ── Upload Secret auth ─────────────────────────────────────────────────────
// Validates X-Upload-Secret header against UPLOAD_SECRET env var.
// Fully independent of admin session, HMAC tokens, and Supabase JWT.

function checkUploadSecret(req: VercelRequest): { ok: boolean; reason?: string } {
  const secret = process.env.UPLOAD_SECRET;
  if (!secret) {
    return { ok: false, reason: "UPLOAD_SECRET is not configured on the server." };
  }
  const provided = req.headers["x-upload-secret"] as string | undefined;
  if (!provided) {
    return { ok: false, reason: "Missing X-Upload-Secret header." };
  }
  if (provided !== secret) {
    return { ok: false, reason: "Invalid upload secret." };
  }
  return { ok: true };
}

// ── Bucket routing ─────────────────────────────────────────────────────────
// Routes to the appropriate Supabase Storage bucket based on content type.

function bucketForContentType(contentType: string): string {
  if (contentType.startsWith("video/")) return "videos";
  if (contentType.startsWith("image/")) return "thumbnails";
  return "documents"; // PDFs, text, everything else
}

function setCors(req: VercelRequest, res: VercelResponse): void {
  const origin = (req.headers.origin as string | undefined) || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Upload-Secret");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Auth: upload secret (independent of admin login)
  const auth = checkUploadSecret(req);
  if (!auth.ok) {
    res.status(401).json({ error: auth.reason ?? "Unauthorized" });
    return;
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    res.status(503).json({
      error: "Storage not configured: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.",
    });
    return;
  }

  const body = req.body as Record<string, string> | undefined;
  const filename = body?.filename;
  const contentType = body?.contentType;

  if (!filename || !contentType) {
    res.status(400).json({ error: "filename and contentType are required" });
    return;
  }

  const bucket = bucketForContentType(contentType);

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const ext = String(filename).split(".").pop() ?? "bin";
    const objectPath = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(objectPath);

    if (error || !data) {
      res.status(500).json({ error: error?.message ?? "Failed to create signed URL" });
      return;
    }

    // Extract token from signed URL query string (Supabase returns relative path)
    const fullSignedUrl = data.signedUrl.startsWith("http")
      ? data.signedUrl
      : `${SUPABASE_URL}/storage/v1${data.signedUrl}`;

    const urlToken = new URL(fullSignedUrl).searchParams.get("token") ?? "";
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${objectPath}`;

    res.status(200).json({
      signedUrl: fullSignedUrl,
      token: urlToken,
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
