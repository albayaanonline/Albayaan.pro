import { adminFetch } from "@/lib/adminFetch";

const UPLOAD_SECRET = (import.meta as any).env?.VITE_UPLOAD_SECRET ?? "";

export interface SignedUploadUrl {
  signedUrl: string;
  publicUrl: string;
  objectPath: string;
  token?: string;
  bucket?: string;
}

/**
 * Upload Manager — requests a Supabase signed upload URL from the API.
 *
 * Auth priority:
 *  1. X-Upload-Secret header (when VITE_UPLOAD_SECRET is set at build time)
 *  2. Authorization: Bearer <token> (HMAC admin token or Supabase JWT, via adminFetch)
 *
 * Both headers are sent simultaneously when available so either auth path
 * on the server can succeed.
 */
export async function requestUploadUrl(
  filename: string,
  contentType: string,
): Promise<SignedUploadUrl> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (UPLOAD_SECRET) {
    headers["X-Upload-Secret"] = UPLOAD_SECRET;
  }

  const res = await adminFetch("/api/storage/upload-url", {
    method: "POST",
    headers,
    body: JSON.stringify({ filename, contentType }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error || `Failed to get upload URL (HTTP ${res.status})`,
    );
  }

  return res.json() as Promise<SignedUploadUrl>;
}
