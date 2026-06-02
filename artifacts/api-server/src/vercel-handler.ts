/**
 * Vercel serverless handler — wraps the full Express app.
 * This file is bundled by build-vercel.mjs into a single .mjs file
 * that Vercel deploys as a serverless function at /api/[...path].
 */
export { default } from "./app.js";
