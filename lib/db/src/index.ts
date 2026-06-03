import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error(
    "[db] ⚠️  DATABASE_URL is not set — all database queries will fail at runtime. " +
    "Add DATABASE_URL to your deployment environment variables.",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL ?? "" });
export const db = drizzle(pool, { schema });

export * from "./schema";
