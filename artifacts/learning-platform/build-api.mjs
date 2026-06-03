/**
 * Bundles the Express API server into a single self-contained ESM file
 * that Vercel deploys as a serverless function alongside the Vite frontend.
 *
 * Output: artifacts/learning-platform/api/backend.mjs
 *
 * Run by the Vercel buildCommand BEFORE `pnpm run build`.
 * With this in place, albayaan.pro/api/* is served by the Express app
 * without needing a second Vercel project.
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import { rm, mkdir } from "node:fs/promises";

globalThis.require = createRequire(import.meta.url);

const frontendDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot    = path.resolve(frontendDir, "../..");
const apiDir      = path.resolve(repoRoot, "artifacts/api-server");

async function buildApi() {
  const outFile = path.resolve(frontendDir, "api/backend.mjs");

  await rm(outFile, { force: true });
  await mkdir(path.dirname(outFile), { recursive: true });

  // Resolve monorepo workspace packages so esbuild can bundle them inline.
  const alias = {
    "@workspace/db":      path.resolve(repoRoot, "lib/db/src/index.ts"),
    "@workspace/api-zod": path.resolve(repoRoot, "lib/api-zod/src/index.ts"),
  };

  await esbuild({
    entryPoints: [path.resolve(apiDir, "src/vercel-entry.ts")],
    platform:    "node",
    bundle:      true,
    format:      "esm",
    outfile:     outFile,
    logLevel:    "info",
    alias,
    // Packages that cannot be bundled (native add-ons, heavy optional deps).
    external: [
      "*.node",
      "sharp", "better-sqlite3", "sqlite3", "canvas", "bcrypt", "argon2",
      "fsevents", "re2", "farmhash", "xxhash-addon", "bufferutil",
      "utf-8-validate", "ssh2", "cpu-features", "dtrace-provider",
      "isolated-vm", "lightningcss", "pg-native", "oracledb",
      "mongodb-client-encryption", "nodemailer", "handlebars", "knex",
      "typeorm", "protobufjs", "onnxruntime-node",
      "@tensorflow/*", "@prisma/client", "@mikro-orm/*", "@grpc/*",
      "@swc/*", "@aws-sdk/*", "@azure/*", "@opentelemetry/*",
      "@google-cloud/*", "@google/*", "googleapis", "firebase-admin",
      "@parcel/watcher", "@sentry/profiling-node", "@tree-sitter/*",
      "aws-sdk", "classic-level", "dd-trace", "ffi-napi", "grpc",
      "hiredis", "kerberos", "leveldown", "miniflare", "mysql2",
      "newrelic", "odbc", "piscina", "realm", "ref-napi", "rocksdb",
      "sass-embedded", "sequelize", "serialport", "snappy", "tinypool",
      "usb", "workerd", "wrangler", "zeromq", "zeromq-prebuilt",
      "playwright", "puppeteer", "puppeteer-core", "electron",
      "pino-pretty", "thread-stream", "pino-worker",
    ],
    sourcemap: false,
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    // Polyfill CJS globals so third-party packages that use __dirname etc. work.
    banner: {
      js: `import { createRequire as __cr } from 'node:module';
import __path from 'node:path';
import __url from 'node:url';
globalThis.require    = __cr(import.meta.url);
globalThis.__filename = __url.fileURLToPath(import.meta.url);
globalThis.__dirname  = __path.dirname(globalThis.__filename);
`,
    },
  });

  console.log("✅  API bundle → api/backend.mjs");
}

buildApi().catch((err) => { console.error(err); process.exit(1); });
