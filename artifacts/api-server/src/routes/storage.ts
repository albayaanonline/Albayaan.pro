import { Router, type IRouter, type Request, type Response } from "express";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { verifySupabaseToken, getBearerToken } from "../middleware/auth";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { Readable } from "stream";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

// ── Admin auth helper ──────────────────────────────────────────────────────

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

// ── POST /storage/upload ───────────────────────────────────────────────────
// Streams the raw request body directly to GCS — no in-memory buffering.
// Supports files of any size (images, videos, PDFs, etc.).

router.post("/storage/upload", async (req: Request, res: Response): Promise<void> => {
  const admin = await isAdmin(req);
  if (!admin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const contentType =
    (req.headers["x-file-type"] as string) ||
    (req.headers["content-type"] ?? "").split(";")[0].trim() ||
    "application/octet-stream";

  const filename = req.headers["x-filename"] as string | undefined;

  const rawLength = req.headers["content-length"];
  const contentLength = rawLength ? parseInt(rawLength, 10) : undefined;

  try {
    let objectPath: string;

    // If the body was already buffered by express.json/urlencoded for some reason
    if (req.body && Buffer.isBuffer(req.body)) {
      objectPath = await objectStorageService.uploadObject(req.body, contentType, filename);
    } else {
      // Stream directly — no memory buffering for large files
      objectPath = await objectStorageService.uploadObjectStream(
        req as unknown as Readable,
        contentType,
        filename,
        contentLength,
      );
    }

    const objectId = objectPath.replace("/objects/", "");
    const host = `${req.protocol}://${req.get("host")}`;
    const publicUrl = `${host}/api/storage/objects/${objectId}`;
    res.json({ objectPath, publicUrl, objectId });
  } catch (error: any) {
    console.error("Upload failed:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error?.message || "Upload failed" });
    }
  }
});

// ── GET /storage/objects/:objectId ─────────────────────────────────────────
// Serves a stored object by its ID, streaming it back to the client.

router.get("/storage/objects/:objectId", async (req: Request, res: Response): Promise<void> => {
  try {
    const objectPath = `/objects/${req.params.objectId}`;
    const file = await objectStorageService.getObjectEntityFile(objectPath);
    const response = await objectStorageService.downloadObject(file);

    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");
    if (contentType) res.setHeader("Content-Type", contentType);
    if (contentLength) res.setHeader("Content-Length", contentLength);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Accept-Ranges", "bytes");

    if (response.body) {
      const readable = Readable.fromWeb(response.body as any);
      readable.pipe(res);
      readable.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) res.status(500).end();
      });
    } else {
      res.status(204).end();
    }
  } catch (err) {
    if (err instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Object not found" });
    } else {
      console.error("Storage serve error:", err);
      res.status(500).json({ error: "Failed to serve object" });
    }
  }
});

// ── GET /storage/public-objects/:filePath ──────────────────────────────────

router.get("/storage/public-objects/:filePath", async (req: Request, res: Response): Promise<void> => {
  try {
    const filePath = req.params.filePath;
    const file = await objectStorageService.searchPublicObject(filePath);
    if (!file) {
      res.status(404).json({ error: "Object not found" });
      return;
    }
    const response = await objectStorageService.downloadObject(file);
    const contentType = response.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");

    if (response.body) {
      const readable = Readable.fromWeb(response.body as any);
      readable.pipe(res);
    } else {
      res.status(204).end();
    }
  } catch {
    res.status(500).json({ error: "Failed to serve object" });
  }
});

export default router;
