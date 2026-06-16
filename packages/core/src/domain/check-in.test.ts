import { describe, expect, it } from "vitest";

import { hasApprovedRevisionForDay } from "./check-in";

describe("hasApprovedRevisionForDay", () => {
  it("treats a day with revisions as adjusted continuation", () => {
    expect(
      hasApprovedRevisionForDay({
        id: "check-in-1",
        userId: "user-1",
        goalId: "goal-1",
        planId: "plan-1",
        date: "2026-06-16",
        status: "adjusted",
        completedPlanItemIds: [],
        skippedPlanItemIds: [],
        revisionIds: ["revision-1"],
        createdAt: "2026-06-16T00:00:00.000Z",
        updatedAt: "2026-06-16T00:00:00.000Z",
      }),
    ).toBe(true);
  });
});
