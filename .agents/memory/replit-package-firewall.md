---
name: Replit package firewall
description: Install constraint and compatibility rationale for the websocket-driver override.
---

The Replit package firewall denied `websocket-driver@0.7.4` during workspace installation. The latest `faye-websocket@0.11.4` accepts `websocket-driver >=0.5.1`, so the compatible `0.7.5` override allowed the learning-platform workspace to install and build.

**Why:** The filtered workspace install could not complete with the blocked version, and the newer patch satisfies the existing parent dependency range.

**How to apply:** Keep the override and lockfile in sync. If changing it, confirm the replacement is permitted by the package firewall and remains within the parent dependency range. Do not bypass the firewall.
