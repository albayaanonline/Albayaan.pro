import { Router, type IRouter, type Request, type Response } from "express";
import { verifySupabaseToken, getBearerToken } from "../middleware/auth";
import { createSignedUploadUrl, uploadToSupabase } from "../lib/supabaseAdmin";

const router: IRouter = Router();

<<<<<<< HEAD
async function isAdmin(req: Request): Promise<boolean> {
  // Path 1: Supabase Bearer token
  const token = getBearerToken(req);
  if (token) {
    const supabaseUser = await verifySupabaseToken(token);
    if (supabaseUser) {
      const [dbUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, supabaseUser.email));
      if (dbUser?.role === "admin") {
        console.log("[storage] isAdmin: granted via Supabase token for", supabaseUser.email);
        return true;
      }
      console.warn("[storage] isAdmin: token valid but user is not admin, email=", supabaseUser.email, "role=", dbUser?.role ?? "not found");
    } else {
      console.warn("[storage] isAdmin: Bearer token present but Supabase verification failed");
    }
  } else {
    console.log("[storage] isAdmin: no Bearer token");
  }

  // Path 2: Express session cookie
  const sessionUserId = (req as any).session?.userId;
  if (sessionUserId) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, sessionUserId));
    if (user?.role === "admin") {
      console.log("[storage] isAdmin: granted via session for userId=", sessionUserId);
      return true;
    }
    console.warn("[storage] isAdmin: session userId=", sessionUserId, "but role=", user?.role ?? "not found");
  } else {
    console.log("[storage] isAdmin: no session userId (cookie may be missing — credentials:include required)");
  }

  return false;
=======
// ── GET /storage/health ────────────────────────────────────────────────────
// Diagnostic endpoint — no auth required. Returns which env vars are present.
// Use this to verify configuration on any deployment without exposing values.

router.get("/storage/health", (_req: Request, res: Response): void => {
  const checks = {
    SUPABASE_URL: Boolean(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
    SUPABASE_ANON_KEY: Boolean(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
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
      ? `Add missing env vars to Vercel → Settings → Environment Variables`
      : "All required environment variables are set",
  });
});

// ── Admin check ────────────────────────────────────────────────────────────
// Verifies the bearer token via Supabase, then checks the DB for admin role.
// Never throws — returns false on any error (DB down, token invalid, etc.).

async function isAdminRequest(req: Request): Promise<{ ok: boolean; reason?: string }> {
  const token = getBearerToken(req);
  if (!token) return { ok: false, reason: "No bearer token" };

  // Step 1: verify the Supabase token
  const supabaseUser = await verifySupabaseToken(token);
  if (!supabaseUser) return { ok: false, reason: "Invalid or expired token" };

  // Step 2: check role from app_metadata (set by Supabase admin)
  // This avoids a DB query and works even if DATABASE_URL is not set.
  const metaRole =
    supabaseUser.app_metadata?.role ?? supabaseUser.user_metadata?.role;
  if (metaRole === "admin") return { ok: true };

  // Step 3: fallback — check role in the DB users table
  try {
    const { db, usersTable } = await import("@workspace/db");
    const { eq } = await import("drizzle-orm");
    const [dbUser] = await db
      .select({ role: usersTable.role })
      .from(usersTable)
      .where(eq(usersTable.email, supabaseUser.email));
    if (dbUser?.role === "admin") return { ok: true };
    return { ok: false, reason: `User role is '${dbUser?.role ?? "unknown"}' (not admin)` };
  } catch (err: any) {
    console.warn("[storage] DB role check failed:", err?.message);
    return { ok: false, reason: `DB unavailable: ${err?.message}` };
  }
>>>>>>> 7a4fb55 (Fix upload errors by improving server stability and error handling)
}

// ── POST /storage/upload-url ───────────────────────────────────────────────
// Generates a Supabase signed upload URL so the client can PUT the file
// directly to Supabase Storage (bypasses the server — any file size).

<<<<<<< HEAD
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
=======
router.post(
  "/storage/upload-url",
  async (req: Request, res: Response): Promise<void> => {
    // Auth check — always returns JSON on failure
    let authResult: { ok: boolean; reason?: string };
    try {
      authResult = await isAdminRequest(req);
    } catch (err: any) {
      res.status(500).json({ error: `Auth check failed: ${err?.message}` });
>>>>>>> 7a4fb55 (Fix upload errors by improving server stability and error handling)
      return;
    }

    if (!authResult.ok) {
      res
        .status(401)
        .json({ error: `Unauthorized: ${authResult.reason ?? "not admin"}` });
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

router.post(
  "/storage/upload",
  async (req: Request, res: Response): Promise<void> => {
    let authResult: { ok: boolean; reason?: string };
    try {
      authResult = await isAdminRequest(req);
    } catch (err: any) {
      res.status(500).json({ error: `Auth check failed: ${err?.message}` });
      return;
    }

    if (!authResult.ok) {
      res
        .status(401)
        .json({ error: `Unauthorized: ${authResult.reason ?? "not admin"}` });
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
