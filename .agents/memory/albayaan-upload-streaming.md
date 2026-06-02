---
name: Albayaan Upload Streaming
description: How the file upload system works — streaming from browser to GCS without memory buffering.
---

## The Problem (solved)
`express.raw()` buffers the entire file body in memory before the route handler runs. For large videos (100MB–500MB), this:
1. Fills Node.js heap → OOM crashes
2. Takes too long → Replit proxy timeout

## The Solution
**Server (`storage.ts`)**: removed `express.raw()`. Route streams `req` (a Node.js Readable) directly to GCS via `objectStorageService.uploadObjectStream()`.

**Why `express.json()` doesn't interfere**: body-parser only reads the body when `Content-Type: application/json`. Binary uploads (video/mp4, image/jpeg, etc.) are skipped entirely — the stream remains intact.

**`objectStorage.ts`**: `uploadObjectStream(stream, contentType, filename?, contentLength?)` uses `pipeline(incomingStream, gcsWriteStream)`. Uses `resumable: true` for files ≥ 5MB, `resumable: false` for smaller files (determined from `Content-Length` header).

**Client (MediaUrlInput.tsx, FileUploader.tsx)**: Both use XHR with `xhr.timeout = 0` (no timeout). `xhr.send(file)` sends the File object directly — browser sets `Content-Type` automatically. Custom headers: `x-file-type` (MIME), `x-filename` (encoded filename). Auth token via `Authorization: Bearer <supabase_token>`.

## How to apply
Any future upload-related work must keep this streaming architecture. Do NOT reintroduce `express.raw()` or any in-memory body buffering on the upload route.
