/**
 * Builds the Express app into a single self-contained ESM file
 * suitable for deployment as a Vercel serverless function.
 *
 * Output: dist-vercel/index.mjs
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import { rm } from "node:fs/promises";

globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(artifactDir, "../..");

async function buildVercel() {
  const distDir = path.resolve(artifactDir, "dist-vercel");
  await rm(distDir, { recursive: true, force: true });

  // Resolve workspace package paths so esbuild can bundle them
  const alias = {
    "@workspace/db": path.resolve(repoRoot, "lib/db/src/index.ts"),
    "@workspace/api-zod": path.resolve(repoRoot, "lib/api-zod/src/index.ts"),
  };

  await esbuild({
    entryPoints: [path.resolve(artifactDir, "src/vercel-entry.ts")],
    platform: "node",
    bundle: true,
    format: "esm",
    outfile: path.join(distDir, "index.mjs"),
    logLevel: "info",
    alias,
    external: [
      "*.node",
      // Packages that cannot be bundled (native modules etc.)
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
      // pino workers — not needed in serverless
      "pino-pretty", "thread-stream", "pino-worker",
    ],
    sourcemap: false,
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';
globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
`,
    },
  });

  console.log("✅ Vercel bundle built: dist-vercel/index.mjs");
}

buildVercel().catch((err) => {
  console.error(err);
  process.exit(1);
});
