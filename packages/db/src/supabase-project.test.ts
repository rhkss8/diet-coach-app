import { describe, expect, it } from "vitest";

import { getSupabaseProjectConfig } from "./index";

describe("getSupabaseProjectConfig", () => {
  it("uses Expo public values for mobile-safe config", () => {
    expect(
      getSupabaseProjectConfig({
        SUPABASE_PROJECT_ID: "diet-coach-app",
        SUPABASE_URL: "http://server-only.local",
        SUPABASE_ANON_KEY: "server-anon",
        EXPO_PUBLIC_SUPABASE_URL: "http://mobile.local",
        EXPO_PUBLIC_SUPABASE_ANON_KEY: "mobile-anon",
      }),
    ).toEqual({
      anonKey: "mobile-anon",
      isConfigured: true,
      projectId: "diet-coach-app",
      url: "http://mobile.local",
    });
  });

  it("reports an unconfigured project when public values are missing", () => {
    expect(getSupabaseProjectConfig({})).toEqual({
      anonKey: null,
      isConfigured: false,
      projectId: null,
      url: null,
    });
  });
});
