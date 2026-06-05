import type { VercelRequest, VercelResponse } from "@vercel/node";

function setCors(req: VercelRequest, res: VercelResponse): void {
  const origin = (req.headers.origin as string | undefined) || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
}

export default function handler(req: VercelRequest, res: VercelResponse): void {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(200).end(); return; }

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

  res.status(200).json({
    ok: missing.length === 0,
    env: checks,
    missing,
  });
}
