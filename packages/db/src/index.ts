export * from "./persistence";
export * from "./schema";

export type SupabaseProjectConfig = {
  anonKey: string | null;
  isConfigured: boolean;
  projectId: string | null;
  url: string | null;
};

export function getSupabaseProjectConfig(
  env: Record<string, string | undefined>,
): SupabaseProjectConfig {
  const projectId = env.SUPABASE_PROJECT_ID ?? null;
  const url = env.EXPO_PUBLIC_SUPABASE_URL ?? env.SUPABASE_URL ?? null;
  const anonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? env.SUPABASE_ANON_KEY ?? null;

  return {
    anonKey,
    isConfigured: Boolean(url && anonKey),
    projectId,
    url,
  };
}
