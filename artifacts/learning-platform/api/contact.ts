import { getPool, setCors, ensureSchema } from "./_db";

export default async function handler(req: any, res: any): Promise<void> {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  const { name, email, message } = (req.body as Record<string, string>) ?? {};
  if (!name || !email || !message) {
    res.status(400).json({ error: "name, email and message are required" }); return;
  }

  try {
    await ensureSchema(getPool());
    await getPool().query(
      `INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)`,
      [String(name), String(email), String(message)]
    );
    res.status(200).json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[contact]", msg);
    res.status(500).json({ error: "Internal server error" });
  }
}
