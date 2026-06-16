import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSupabaseProjectConfig } from "@diet-coach/db";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type RuntimeEnv = Record<string, string | undefined>;

let cachedSupabaseClient: SupabaseClient | null | undefined;

export function getMobileSupabaseClient(env: RuntimeEnv = getRuntimeEnv()) {
  if (cachedSupabaseClient !== undefined) {
    return cachedSupabaseClient;
  }

  const config = getSupabaseProjectConfig(env);

  if (!config.isConfigured || !config.url || !config.anonKey) {
    cachedSupabaseClient = null;
    return cachedSupabaseClient;
  }

  cachedSupabaseClient = createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      storage: AsyncStorage,
    },
  });

  return cachedSupabaseClient;
}

export function resetMobileSupabaseClientForTest() {
  cachedSupabaseClient = undefined;
}

function getRuntimeEnv(): RuntimeEnv {
  return globalThisWithProcess.process?.env ?? {};
}

const globalThisWithProcess = globalThis as typeof globalThis & {
  process?: {
    env?: RuntimeEnv;
  };
};
