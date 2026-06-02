import app from "./app";
import { logger } from "./lib/logger";
import { ensureStorageBucket } from "./lib/supabaseAdmin";

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

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // Initialize Supabase Storage bucket in the background.
  // Requires SUPABASE_SERVICE_ROLE_KEY in environment variables.
  ensureStorageBucket().catch((e) =>
    logger.warn({ err: e }, "[storage] Bucket initialization failed"),
  );
});
