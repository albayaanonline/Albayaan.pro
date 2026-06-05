import type { VercelRequest, VercelResponse } from "@vercel/node";

function setCors(req: VercelRequest, res: VercelResponse): void {
  const origin = (req.headers.origin as string | undefined) || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
}

export default function handler(req: VercelRequest, res: VercelResponse): void {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  res.status(200).json({ message: "Logged out" });
}
