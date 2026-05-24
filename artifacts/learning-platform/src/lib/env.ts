export const env = {
  supabaseUrl:    import.meta.env.VITE_SUPABASE_URL   as string | undefined,
  supabaseKey:    import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
  openaiKey:      import.meta.env.VITE_OPENAI_API_KEY as string | undefined,
  apiBaseUrl:     import.meta.env.VITE_API_BASE_URL   as string | undefined,
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined ?? "+252602000000",
  isDev:          import.meta.env.DEV  as boolean,
  isProd:         import.meta.env.PROD as boolean,
} as const;

export function hasSupabase(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseKey);
}

export function hasOpenAI(): boolean {
  return Boolean(env.openaiKey);
}
