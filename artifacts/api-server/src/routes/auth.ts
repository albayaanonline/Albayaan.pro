import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { RegisterBody, LoginBody } from "@workspace/api-zod";
import { verifySupabaseToken } from "../middleware/auth";

const router: IRouter = Router();

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, password } = parsed.data;

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing) {
    res.status(400).json({ error: "Email already in use" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(usersTable).values({ name, email, passwordHash }).returning();

  req.session.userId = user.id;
  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  if (user.passwordHash === "supabase-auth") {
    res.status(400).json({ error: "Please sign in with your Supabase account." });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  req.session.userId = user.id;
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
});

router.post("/auth/session-from-supabase", async (req, res): Promise<void> => {
  const authHeader = req.headers.authorization as string | undefined;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.slice(7);
  const supabaseUser = await verifySupabaseToken(token);
  if (!supabaseUser || !supabaseUser.email) {
    res.status(401).json({ error: "Invalid Supabase token" });
    return;
  }

  const email = supabaseUser.email.toLowerCase().trim();
  let [dbUser] = await db.select().from(usersTable).where(eq(usersTable.email, email));

  if (!dbUser) {
    const name = supabaseUser.user_metadata?.name || email.split("@")[0];
    const [created] = await db
      .insert(usersTable)
      .values({ name, email, passwordHash: "supabase-auth", role: "user" })
      .returning();
    dbUser = created;
  } else if (dbUser.name === "supabase-auth" || !dbUser.name) {
    const name = supabaseUser.user_metadata?.name || email.split("@")[0];
    const [updated] = await db.update(usersTable).set({ name }).where(eq(usersTable.id, dbUser.id)).returning();
    dbUser = updated;
  }

  req.session.userId = dbUser.id;

  res.json({
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
    supabaseId: supabaseUser.id,
    createdAt: dbUser.createdAt,
  });
});

router.post("/auth/forgot-password", async (req, res): Promise<void> => {
  const { email } = req.body;
  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Email is required" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim()));
  if (user) {
    console.log(`[auth] Password reset requested for user id=${user.id}`);
  }
  res.json({ success: true, message: "If an account exists, a reset link will be sent." });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  req.session.destroy(() => {});
  res.json({ message: "Logged out" });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId));
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
});

router.post("/admin/elevate", async (req, res): Promise<void> => {
  const { email, secret } = req.body;
  const adminSecret = process.env.ADMIN_ELEVATION_SECRET;

  if (!adminSecret || !secret || secret !== adminSecret) {
    res.status(403).json({ error: "Invalid or missing admin secret." });
    return;
  }

  if (!email) {
    res.status(400).json({ error: "email is required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim()));
  if (!user) {
    res.status(404).json({ error: "User not found. Register first, then elevate." });
    return;
  }

  const [updated] = await db
    .update(usersTable)
    .set({ role: "admin" })
    .where(eq(usersTable.id, user.id))
    .returning();

  res.json({ success: true, user: { id: updated.id, email: updated.email, role: updated.role } });
});

export default router;
