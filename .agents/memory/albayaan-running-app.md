---
name: Albayaan Running App Directory
description: The correct directory for all frontend edits — artifacts/learning-platform/, not albayaan-pro/
---

## Rule

All frontend code changes must target `artifacts/learning-platform/src/`.

**Why:** There are two frontend directories in the repo:
- `artifacts/learning-platform/` — the registered Replit artifact, served by the `@workspace/learning-platform` workflow. This is what users see.
- `albayaan-pro/` — an older sibling directory with package name `albayaan-pro`. It is NOT served by any active workflow.

Editing `albayaan-pro/` has no visible effect on the running app.

**How to apply:** Whenever you need to edit any frontend file (pages, components, contexts, hooks, API client), confirm the path starts with `artifacts/learning-platform/src/`. If you find yourself about to edit `albayaan-pro/src/`, stop and redirect to the correct path.
