import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { createHmac } from "crypto";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function getSecret(): string {
  return process.env.SESSION_SECRET ?? "albayaan-secret-fallback";
}

function verifyToken(token: string): { userId: number; role: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon === -1) return null;
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);
    const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");
    if (sig !== expected) return null;
    const parts = payload.split(":");
    if (parts.length < 3) return null;
    const expiresStr = parts[parts.length - 1];
    const role = parts.slice(1, -1).join(":");
    if (Date.now() > parseInt(expiresStr, 10)) return null;
    const userId = parseInt(parts[0], 10);
    if (isNaN(userId)) return null;
    return { userId, role };
  } catch {
    return null;
  }
}

function setCors(req: VercelRequest, res: VercelResponse): void {
  const origin = (req.headers.origin as string | undefined) || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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

  const auth = req.headers.authorization as string | undefined;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Unauthorized — admin login required" });
    return;
  }
  const claims = verifyToken(token);
  if (!claims || claims.role !== "admin") {
    res.status(401).json({ error: "Unauthorized — admin login required" });
    return;
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    res.status(503).json({
      error: "Storage not configured: SUPABASE_SERVICE_ROLE_KEY is not set in environment variables.",
    });
    return;
  }

  const body = req.body as Record<string, string> | undefined;
  const filename = body?.filename;
  const contentType = body?.contentType;
  const bucket = body?.bucket ?? "course-thumbnails";

  if (!filename || !contentType) {
    res.status(400).json({ error: "filename and contentType are required" });
    return;
  }

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

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${objectPath}`;

    res.status(200).json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: objectPath,
      objectPath,
      publicUrl,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[storage/upload-url]", msg);
    res.status(500).json({ error: msg });
  }
}
