import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
<<<<<<< HEAD
  console.error(
    "[db] ⚠️  DATABASE_URL is not set — all database queries will fail at runtime. " +
    "Add DATABASE_URL to your deployment environment variables.",
=======
  console.warn(
    "[db] DATABASE_URL is not set — database queries will fail. " +
      "Add DATABASE_URL to your environment variables.",
>>>>>>> 7a4fb55 (Fix upload errors by improving server stability and error handling)
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL ?? "" });
export const db = drizzle(pool, { schema });

export * from "./schema";
