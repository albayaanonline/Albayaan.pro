import { Router, type IRouter, type Request, type Response } from "express";
import { verifySupabaseToken, getBearerToken } from "../middleware/auth";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { uploadToSupabase, createSignedUploadUrl } from "../lib/supabaseAdmin";

const router: IRouter = Router();

async function isAdmin(req: Request): Promise<boolean> {
  const token = getBearerToken(req);
  if (token) {
    const supabaseUser = await verifySupabaseToken(token);
    if (supabaseUser) {
      const [dbUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, supabaseUser.email));
      if (dbUser?.role === "admin") return true;
    }
  }
  const sessionUserId = (req as any).session?.userId;
  if (sessionUserId) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, sessionUserId));
    if (user?.role === "admin") return true;
  }
  return false;
}

// ── POST /storage/upload-url ───────────────────────────────────────────────
// Generates a Supabase signed upload URL so the client can upload directly.
// The file never passes through this server — works for any file size.

router.post("/storage/upload-url", async (req: Request, res: Response): Promise<void> => {
  let admin = false;
  try {
    admin = await isAdmin(req);
  } catch (err: any) {
    console.error("[storage] isAdmin check failed:", err?.message ?? err);
    res.status(500).json({ error: `Auth check failed: ${err?.message ?? "internal error"}` });
    return;
  }

  if (!admin) {
    res.status(401).json({ error: "Unauthorized — admin login required" });
    return;
  }

  const { filename, contentType } = req.body ?? {};
  if (!filename || !contentType) {
    res.status(400).json({ error: "filename and contentType are required" });
    return;
  }

  try {
    const result = await createSignedUploadUrl(filename as string, contentType as string);
    res.json(result);
  } catch (error: any) {
    console.error("[storage] Failed to create signed URL:", error?.message ?? error);
    res.status(500).json({ error: error?.message ?? "Failed to create signed URL" });
  }
});

// ── POST /storage/upload ───────────────────────────────────────────────────
// Legacy: buffers the request body and uploads it to Supabase Storage.
// For large files use /storage/upload-url (signed URL + direct upload) instead.

router.post("/storage/upload", async (req: Request, res: Response): Promise<void> => {
  let admin = false;
  try {
    admin = await isAdmin(req);
  } catch (err: any) {
    console.error("[storage] isAdmin check failed:", err?.message ?? err);
    res.status(500).json({ error: `Auth check failed: ${err?.message ?? "internal error"}` });
    return;
  }

  if (!admin) {
    res.status(401).json({ error: "Unauthorized — admin login required" });
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
  } catch (error: any) {
    console.error("[storage] Upload error:", error?.message ?? error);
    if (!res.headersSent) {
      res.status(500).json({ error: error?.message ?? "Upload failed" });
    }
  }
});

export default router;
