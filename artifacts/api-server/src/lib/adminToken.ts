import { createHmac } from "crypto";

const getSecret = (): string =>
  process.env.SESSION_SECRET ?? "albayaan-secret-fallback";

const TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Creates a self-signed HMAC-SHA256 Bearer token encoding userId and role.
 * Token format (base64url-encoded): userId:role:expiresMs:hmacHex
 */
export function createAdminToken(userId: number, role: string): string {
  const expires = Date.now() + TTL_MS;
  const payload = `${userId}:${role}:${expires}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

/**
 * Verifies a token created by createAdminToken.
 * Returns { userId, role } on success, null on any failure (expired, tampered, malformed).
 */
export function verifyAdminToken(
  token: string,
): { userId: number; role: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon === -1) return null;
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);
    const expected = createHmac("sha256", getSecret())
      .update(payload)
      .digest("hex");
    if (sig !== expected) return null;
    const parts = payload.split(":");
    if (parts.length < 3) return null;
    const userIdStr = parts[0];
    const expiresStr = parts[parts.length - 1];
    const role = parts.slice(1, -1).join(":");
    if (Date.now() > parseInt(expiresStr, 10)) return null;
    const userId = parseInt(userIdStr, 10);
    if (isNaN(userId)) return null;
    return { userId, role };
  } catch {
    return null;
  }
}
