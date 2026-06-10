#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --filter @workspace/db run push-force 2>/dev/null || echo "[post-merge] DB push skipped (non-interactive)"
