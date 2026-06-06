import { Router, type IRouter, type Request, type Response } from "express";
import { createSignedUploadUrl, uploadToSupabase } from "../lib/supabaseAdmin";

const router: IRouter = Router();

// ── Upload Secret check ────────────────────────────────────────────────────
// Validates the X-Upload-Secret header against the UPLOAD_SECRET env var.
// This is completely independent of admin session, HMAC token, or Supabase JWT.
// If UPLOAD_SECRET is not set, uploads are rejected with a configuration error.

function checkUploadSecret(req: Request): { ok: boolean; reason?: string } {
  const secret = process.env.UPLOAD_SECRET;
  if (!secret) {
    return { ok: false, reason: "UPLOAD_SECRET environment variable is not set on the server." };
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

// ── GET /storage/health ────────────────────────────────────────────────────
// Diagnostic endpoint — no auth required.

router.get("/storage/health", (_req: Request, res: Response): void => {
  const checks = {
    SUPABASE_URL: Boolean(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
    SUPABASE_ANON_KEY: Boolean(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    UPLOAD_SECRET: Boolean(process.env.UPLOAD_SECRET),
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    SESSION_SECRET: Boolean(process.env.SESSION_SECRET),
  };

  const missing = Object.entries(checks)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  res.json({
    ok: missing.length === 0,
    env: checks,
    missing,
    note: missing.length > 0
      ? `Add missing env vars to your environment variables`
      : "All required environment variables are set",
  });
});

// ── POST /storage/upload-url ───────────────────────────────────────────────
// Generates a Supabase signed upload URL so the client can PUT the file
// directly to Supabase Storage (bypasses the server — any file size).
//
// Auth: X-Upload-Secret header (independent of admin session).
// Supported content types: video/*, image/*, application/pdf, text/*

router.post(
  "/storage/upload-url",
  async (req: Request, res: Response): Promise<void> => {
    const auth = checkUploadSecret(req);
    if (!auth.ok) {
      res.status(401).json({ error: auth.reason ?? "Unauthorized" });
      return;
    }

    const { filename, contentType } = req.body ?? {};
    if (!filename || !contentType) {
      res.status(400).json({ error: "filename and contentType are required" });
      return;
    }

    try {
      const result = await createSignedUploadUrl(
        filename as string,
        contentType as string,
      );
      res.json(result);
    } catch (err: any) {
      const message = err?.message ?? "Failed to create signed upload URL";
      console.error("[storage] createSignedUploadUrl failed:", message);
      res.status(500).json({ error: message });
    }
  },
);

// ── POST /storage/upload ───────────────────────────────────────────────────
// Legacy direct-upload route. Buffers the full body and streams to Supabase.
// For large files, prefer /storage/upload-url (signed URL + direct client PUT).
//
// Auth: X-Upload-Secret header (independent of admin session).

router.post(
  "/storage/upload",
  async (req: Request, res: Response): Promise<void> => {
    const auth = checkUploadSecret(req);
    if (!auth.ok) {
      res.status(401).json({ error: auth.reason ?? "Unauthorized" });
      return;
    }

    const contentType =
      (req.headers["x-file-type"] as string) ||
      (req.headers["content-type"] ?? "").split(";")[0].trim() ||
      "application/octet-stream";

    const filename = req.headers["x-filename"]
      ? decodeURIComponent(req.headers["x-filename"] as string)
      : undefined;

    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as any));
      }
      const buffer = Buffer.concat(chunks);

      if (buffer.length === 0) {
        res.status(400).json({ error: "Empty file — no data received" });
        return;
      }

      const publicUrl = await uploadToSupabase(buffer, contentType, filename);
      res.json({ publicUrl, url: publicUrl, objectPath: publicUrl });
    } catch (err: any) {
      const message = err?.message ?? "Upload failed";
      console.error("[storage] upload error:", message);
      if (!res.headersSent) {
        res.status(500).json({ error: message });
      }
    }
  },
);

export default router;
