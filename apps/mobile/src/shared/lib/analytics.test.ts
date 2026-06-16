import { beforeEach, describe, expect, it } from "vitest";

import {
  clearTrackedAnalyticsEvents,
  createSupabaseAnalyticsProvider,
  readTrackedAnalyticsEvents,
  resetAnalyticsProvider,
  setAnalyticsProvider,
  trackAnalyticsEvent,
} from "./analytics";

describe("mobile analytics recorder", () => {
  beforeEach(() => {
    resetAnalyticsProvider();
    clearTrackedAnalyticsEvents();
  });

  it("records typed analytics events", () => {
    trackAnalyticsEvent("ONBOARDING_STARTED", {});
    trackAnalyticsEvent("PLAN_APPROVED", {
      userId: "local-user",
      goalId: "goal-1",
      planId: "plan-1",
    });

    expect(readTrackedAnalyticsEvents().map((event) => event.name)).toEqual([
      "ONBOARDING_STARTED",
      "PLAN_APPROVED",
    ]);
  });

  it("can send events through a configured provider", () => {
    const events: unknown[] = [];

    setAnalyticsProvider({
      track: (event) => {
        events.push(event);
      },
    });

    const event = trackAnalyticsEvent("ONBOARDING_STARTED", {});

    expect(events).toEqual([event]);
    expect(readTrackedAnalyticsEvents()).toEqual([]);
  });

  it("maps events to Supabase analytics rows", async () => {
    const rows: unknown[] = [];
    const provider = createSupabaseAnalyticsProvider({
      from: (tableName) => ({
        insert: async (row) => {
          rows.push({ row, tableName });
          return { error: null };
        },
      }),
    });

    await provider.track(
      trackAnalyticsEvent("PLAN_APPROVED", {
        userId: "local-user",
        goalId: "goal-1",
        planId: "plan-1",
      }),
    );

    expect(rows).toEqual([
      {
        row: expect.objectContaining({
          name: "PLAN_APPROVED",
          user_id: "local-user",
        }),
        tableName: "analytics_events",
      },
    ]);
  });
});
