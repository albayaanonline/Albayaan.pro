const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function setCors(req: any, res: any): void {
  const origin = (req.headers.origin as string | undefined) ?? "";
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
}

export default async function handler(req: any, res: any): Promise<void> {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    res.status(503).json({ error: "Auth service not configured" });
    return;
  }

  const authHeader = req.headers.authorization as string | undefined;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing Bearer token" });
    return;
  }

  const token = authHeader.slice(7);
  const apiKey = SUPABASE_ANON_KEY || SERVICE_ROLE_KEY;

  try {
    // 1. Verify token with Supabase and get public user profile
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: apiKey },
    });
    if (!userRes.ok) {
      res.status(401).json({ error: "Invalid or expired Supabase token" });
      return;
    }
    const user = (await userRes.json()) as Record<string, any>;
    if (!user?.id || !user?.email) {
      res.status(401).json({ error: "Could not retrieve user from token" });
      return;
    }

    // 2. Determine role — check app_metadata fast path first
    let role: "admin" | "user" =
      user?.app_metadata?.role === "admin" ||
      user?.user_metadata?.role === "admin"
        ? "admin"
        : "user";

    // 3. If not admin yet, re-check via Admin API (service role sees full metadata)
    if (role !== "admin") {
      const adminRes = await fetch(
        `${SUPABASE_URL}/auth/v1/admin/users/${user.id}`,
        {
          headers: {
            apikey: SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          },
        },
      );
      if (adminRes.ok) {
        const adminUser = (await adminRes.json()) as Record<string, any>;
        if (
          adminUser?.app_metadata?.role === "admin" ||
          adminUser?.user_metadata?.role === "admin"
        ) {
          role = "admin";
        }
      }
    }

    const name =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user.email.split("@")[0];

    res.status(200).json({
      id: user.id,
      supabaseId: user.id,
      email: user.email,
      name,
      role,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[auth/session-from-supabase]", msg);
    res.status(500).json({ error: msg });
  }
}
