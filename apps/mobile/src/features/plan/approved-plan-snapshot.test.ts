import { describe, expect, it } from "vitest";

import {
  createApprovedPlanSnapshot,
  parseApprovedPlanSnapshot,
  serializeApprovedPlanSnapshot,
} from "./approved-plan-snapshot";

const plan = {
  id: "plan-1",
  goalId: "goal-1",
  startDate: "2026-06-16",
  endDate: "2026-06-22",
  summary: "7일 플랜",
  items: [],
};

describe("approved plan snapshot", () => {
  it("creates a snapshot with approval time", () => {
    expect(createApprovedPlanSnapshot(plan, "2026-06-16T00:00:00.000Z")).toEqual({
      plan,
      approvedAt: "2026-06-16T00:00:00.000Z",
    });
  });

  it("keeps the plan basis used when the plan was approved", () => {
    expect(
      createApprovedPlanSnapshot(plan, "2026-06-16T00:00:00.000Z", {
        goal: {
          targetWeightKg: 66,
        },
        profile: {
          age: 34,
          currentWeightKg: 72,
          heightCm: 164,
          sex: "prefer_not_to_say",
        },
      }),
    ).toEqual({
      approvedAt: "2026-06-16T00:00:00.000Z",
      plan,
      planBasis: {
        goal: {
          targetWeightKg: 66,
        },
        profile: {
          age: 34,
          currentWeightKg: 72,
          heightCm: 164,
          sex: "prefer_not_to_say",
        },
      },
    });
  });

  it("serializes and parses snapshots", () => {
    const snapshot = createApprovedPlanSnapshot(plan, "2026-06-16T00:00:00.000Z");

    expect(parseApprovedPlanSnapshot(serializeApprovedPlanSnapshot(snapshot))).toEqual(snapshot);
  });

  it("returns null for invalid data", () => {
    expect(parseApprovedPlanSnapshot("not json")).toBeNull();
    expect(parseApprovedPlanSnapshot("{}")).toBeNull();
  });
});
