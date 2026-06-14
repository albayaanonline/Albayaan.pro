import app from "./app";
import { logger } from "./lib/logger";
import { ensureStorageBucket } from "./lib/supabaseAdmin";
import { ensureSchema, seedIfEmpty } from "./lib/seed";
import { pool } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function ensureSessionTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "user_sessions" (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL,
      CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
    ) WITH (OIDS=FALSE);
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS "IDX_user_sessions_expire" ON "user_sessions" ("expire");
  `);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  ensureSessionTable().catch((e) =>
    logger.warn({ err: e }, "[session] Session table init failed"),
  );

  ensureStorageBucket().catch((e) =>
    logger.warn({ err: e }, "[storage] Bucket initialization failed"),
  );

  ensureSchema()
    .then(() => seedIfEmpty())
    .catch((e) => logger.warn({ err: e }, "[seed] Seed failed"));
});
