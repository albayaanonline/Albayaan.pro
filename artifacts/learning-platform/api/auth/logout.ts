import { setCors } from "../_db";

export default function handler(req: any, res: any): void {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  res.status(200).json({ ok: true });
}
