import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import {
  RegisterBody,
  LoginBody,
} from "@workspace/api-zod";

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
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
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

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  req.session.userId = user.id;
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

router.post("/auth/forgot-password", async (req, res): Promise<void> => {
  const { email } = req.body;
  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Email is required" });
    return;
  }
  // Always return success to prevent email enumeration attacks.
  // In production, an email service would send a reset link here.
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim()));
  if (user) {
    // A real implementation would send a reset token via email here.
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

export default router;
