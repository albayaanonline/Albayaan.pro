---
name: Albayaan Certificates
description: Certificate generation, QR codes, and verification system.
---

## Certificate ID Format
`ALBAYAAN-XXXX-XXXX` — deterministic hash of `userId` + `courseId` (no year).

**Why no year:** Including `new Date().getFullYear()` would generate a different ID each year for the same student/course, breaking verification links.

## Generation
```ts
function generateCertId(userId: string, courseId: string): string {
  let hash = 0;
  const str = `ALBAYAAN-${userId}-${courseId}`.toUpperCase();
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
  return `ALBAYAAN-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
}
```

## QR Code
Inline SVG QR code (no external library) is rendered on the certificate pointing to `/verify/:certId`. The SVG is a simplified representation using finder patterns + deterministic fill from the cert ID string.

## Auto-Save
On Certificate page load (if course is 100% complete), a POST to `/api/certificates` auto-saves the cert to the DB. The endpoint is idempotent (unique constraint on `cert_id`).

## Verification
`GET /api/certificates/:certId` — public endpoint returns cert details. Used by `/verify` page.

## Admin View
`/api/admin/certificates` returns all issued certs. Admin Certificates tab shows real data from DB with links to `/verify/:certId`.
