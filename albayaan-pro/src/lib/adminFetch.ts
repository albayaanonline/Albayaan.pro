import { supabase } from "@/lib/supabase";
import { env } from "@/lib/env";

const ADMIN_TOKEN_KEY = "albayaan_admin_token";

export function storeAdminToken(token: string): void {
  try { localStorage.setItem(ADMIN_TOKEN_KEY, token); } catch {}
}

export function clearAdminToken(): void {
  try { localStorage.removeItem(ADMIN_TOKEN_KEY); } catch {}
}

async function getAdminToken(): Promise<string | null> {
  try {
    const stored = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (stored) return stored;
  } catch {}
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

export function resolveApiUrl(url: string): string {
  if (!env.apiBaseUrl) return url;
  const base = env.apiBaseUrl.replace(/\/$/, "");
  const path = url.replace(/^\/api(?=\/|$)/, "") || "/";
  return `${base}${path}`;
}

export async function adminFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getAdminToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (options.body && typeof options.body === "string" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  return fetch(resolveApiUrl(url), { ...options, headers, credentials: "include" });
}

export async function adminJson<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await adminFetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err?.error || `Request failed: ${res.status}`);
  }
  return res.json();
}
