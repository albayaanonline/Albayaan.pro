function setCors(req: any, res: any): void {
  const origin = (req.headers.origin as string | undefined) ?? "";
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default function handler(req: any, res: any): void {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }

  const check = (key: string) => Boolean(process.env[key]);

  res.status(200).json({
    env: {
      SUPABASE_URL:             check("SUPABASE_URL"),
      VITE_SUPABASE_URL:        check("VITE_SUPABASE_URL"),
      SUPABASE_ANON_KEY:        check("SUPABASE_ANON_KEY"),
      VITE_SUPABASE_ANON_KEY:   check("VITE_SUPABASE_ANON_KEY"),
      SUPABASE_SERVICE_ROLE_KEY: check("SUPABASE_SERVICE_ROLE_KEY"),
      SESSION_SECRET:           check("SESSION_SECRET"),
      UPLOAD_SECRET:            check("UPLOAD_SECRET"),
      VITE_UPLOAD_SECRET:       check("VITE_UPLOAD_SECRET"),
      DATABASE_URL:             check("DATABASE_URL"),
    },
  });
}
