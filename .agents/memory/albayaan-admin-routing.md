---
name: Albayaan Admin Routing
description: How Wouter routes are structured for /admin paths — critical ordering to avoid 404 on /admin/login.
---

# Rule
`/admin/login` must appear as a standalone `<Route>` **before** any `/admin/:rest*` wildcard catch in the Wouter `<Switch>`. AdminLayout wraps only the protected sub-routes, not the login page.

**Why:** Wouter matches routes in order; if `/admin/:rest*` appears first, `/admin/login` gets caught by it and rendered inside AdminLayout (which redirects unauthenticated users, causing a loop or 404).

**How to apply:**
```tsx
<Switch>
  <Route path="/admin/login" component={AdminLogin} />   {/* standalone — NO AdminLayout */}
  <Route path="/admin">
    <AdminLayout><ProtectedRoute path="/admin" component={AdminDashboard} adminOnly /></AdminLayout>
  </Route>
  <Route path="/admin/:rest*">
    <AdminLayout>{/* other admin sub-routes */}</AdminLayout>
  </Route>
  <Route>{/* MainLayout + public routes */}</Route>
</Switch>
```

**Default admin credentials (hardcoded local fallback):**
- Email: `admin@example.com`
- Password: `Admin123`
- Stored in localStorage under key `albayaan_admin_user` via `loginAsAdmin()` in AuthContext.
