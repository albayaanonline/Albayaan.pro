const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL ??
  "";

const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY ??
  "";

export interface SupabaseUser {
  id: string;
  email: string;
  user_metadata: { name?: string; role?: string };
  app_metadata: { role?: string };
}

export async function verifySupabaseToken(token: string): Promise<SupabaseUser | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "apikey": SUPABASE_KEY,
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as SupabaseUser;
  } catch {
    return null;
  }
}

export function getBearerToken(req: any): string | null {
  const auth = req.headers?.authorization as string | undefined;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export function getSupabaseUserRole(user: SupabaseUser): string {
  return user.app_metadata?.role ?? user.user_metadata?.role ?? "user";
}
