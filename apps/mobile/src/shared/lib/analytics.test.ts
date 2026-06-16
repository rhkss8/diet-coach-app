import { beforeEach, describe, expect, it } from "vitest";

import {
  clearTrackedAnalyticsEvents,
  readTrackedAnalyticsEvents,
  trackAnalyticsEvent,
} from "./analytics";

describe("mobile analytics recorder", () => {
  beforeEach(() => {
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
});
