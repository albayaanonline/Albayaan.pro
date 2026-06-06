import { resolveApiUrl } from "@/lib/adminFetch";

const UPLOAD_SECRET = (import.meta as any).env?.VITE_UPLOAD_SECRET ?? "";

export interface SignedUploadUrl {
  signedUrl: string;
  publicUrl: string;
  objectPath: string;
  token?: string;
  bucket?: string;
}

/**
 * Upload Manager — fully independent of admin session auth.
 *
 * Uses a dedicated VITE_UPLOAD_SECRET header to authorize signed URL
 * generation. Works regardless of whether admin login is available.
 *
 * Supports: videos, PDFs, images, thumbnails (bucket routing is server-side
 * based on contentType).
 */
export async function requestUploadUrl(
  filename: string,
  contentType: string,
): Promise<SignedUploadUrl> {
  const res = await fetch(resolveApiUrl("/api/storage/upload-url"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Upload-Secret": UPLOAD_SECRET,
    },
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
