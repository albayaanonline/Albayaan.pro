import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { verifySupabaseToken, getBearerToken } from "../middleware/auth";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

const RequestUploadUrlBody = z.object({
  name: z.string(),
  size: z.number().optional(),
  contentType: z.string().optional(),
});

async function isAdmin(req: Request): Promise<boolean> {
  const token = getBearerToken(req);
  if (token) {
    const supabaseUser = await verifySupabaseToken(token);
    if (supabaseUser) {
      const [dbUser] = await db.select().from(usersTable).where(eq(usersTable.email, supabaseUser.email));
      if (dbUser?.role === "admin") return true;
    }
  }
  const sessionUserId = (req as any).session?.userId;
  if (sessionUserId) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, sessionUserId));
    if (user?.role === "admin") return true;
  }
  return false;
}

router.post("/storage/uploads/request-url", async (req: Request, res: Response) => {
  const admin = await isAdmin(req);
  if (!admin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid required fields" });
    return;
  }

  try {
    const { name, size, contentType } = parsed.data;
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

    res.json({
      uploadURL,
      objectPath,
      metadata: { name, size, contentType },
    });
  } catch (error) {
    console.error("Upload URL generation failed:", error);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

router.get("/storage/objects/:objectId", async (req: Request, res: Response) => {
  try {
    const objectPath = `/objects/${req.params.objectId}`;
    const file = await objectStorageService.getObjectEntityFile(objectPath);
    const response = await objectStorageService.downloadObject(file);

    const contentType = response.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000");

    if (response.body) {
      const { Readable } = await import("stream");
      const readable = Readable.fromWeb(response.body as any);
      readable.pipe(res);
    } else {
      res.status(204).end();
    }
  } catch (err) {
    if (err instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Object not found" });
    } else {
      res.status(500).json({ error: "Failed to serve object" });
    }
  }
});

router.get("/storage/public-objects/:filePath", async (req: Request, res: Response) => {
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
      const { Readable } = await import("stream");
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
