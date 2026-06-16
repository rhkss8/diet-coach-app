import { describe, expect, it } from "vitest";

import {
  analyticsEventNames,
  createAnalyticsEvent,
  isAnalyticsEventName,
  isRecoveryMetricEventName,
} from "./events";

describe("analytics events", () => {
  it("keeps event names unique and uppercase snake case", () => {
    const uniqueEventNames = new Set(analyticsEventNames);

    expect(uniqueEventNames.size).toBe(analyticsEventNames.length);
    expect(analyticsEventNames.every((eventName) => /^[A-Z0-9_]+$/.test(eventName))).toBe(true);
  });

  it("recognizes known event names", () => {
    expect(isAnalyticsEventName("PLAN_REVISION_APPROVED")).toBe(true);
    expect(isAnalyticsEventName("plan_revision_approved")).toBe(false);
  });

  it("creates typed plan item events", () => {
    const event = createAnalyticsEvent("PLAN_ITEM_COMPLETED", {
      userId: "user-1",
      goalId: "goal-1",
      planId: "plan-1",
      planItemId: "item-1",
      type: "meal",
      date: "2026-06-16",
    });

    expect(event.name).toBe("PLAN_ITEM_COMPLETED");
    expect(event.payload.planItemId).toBe("item-1");
  });

  it("marks recovery metric events for MVP reporting", () => {
    expect(isRecoveryMetricEventName("PLAN_REVISION_APPROVED")).toBe(true);
    expect(isRecoveryMetricEventName("PLAN_APPROVED")).toBe(false);
  });
});
