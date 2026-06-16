import { describe, expect, it } from "vitest";

import { getPlanItemsForDate, isPlanItemAdjustable, isPlanRevisionApproved } from "./plan";

import type { Plan, PlanItem, PlanRevision } from "./plan";

const pendingMeal: PlanItem = {
  id: "meal-1",
  planId: "plan-1",
  date: "2026-06-16",
  type: "meal",
  slot: "lunch",
  title: "일반식 점심",
  description: "평소 먹는 점심을 기준으로 조정합니다.",
  status: "pending",
};

describe("isPlanItemAdjustable", () => {
  it("allows pending and skipped plan items to be adjusted", () => {
    expect(isPlanItemAdjustable(pendingMeal)).toBe(true);
    expect(isPlanItemAdjustable({ ...pendingMeal, id: "workout-1", status: "skipped" })).toBe(true);
  });

  it("does not allow completed items to be adjusted", () => {
    expect(isPlanItemAdjustable({ ...pendingMeal, id: "meal-2", status: "completed" })).toBe(false);
  });
});

describe("getPlanItemsForDate", () => {
  it("returns plan items for the requested day", () => {
    const plan: Plan = {
      id: "plan-1",
      goalId: "goal-1",
      startDate: "2026-06-16",
      endDate: "2026-06-22",
      summary: "7일 기본 플랜",
      status: "active",
      createdAt: "2026-06-16T00:00:00.000Z",
      updatedAt: "2026-06-16T00:00:00.000Z",
      items: [
        pendingMeal,
        {
          ...pendingMeal,
          id: "meal-2",
          date: "2026-06-17",
          slot: "dinner",
        },
      ],
    };

    expect(getPlanItemsForDate(plan, "2026-06-16")).toEqual([pendingMeal]);
  });
});

describe("isPlanRevisionApproved", () => {
  it("uses revision status instead of inferring from changed items", () => {
    const revision: PlanRevision = {
      id: "revision-1",
      planId: "plan-1",
      affectedDate: "2026-06-16",
      reason: "meal_changed",
      status: "approved",
      summary: "저녁을 가볍게 조정",
      userMessage: "괜찮아요. 오늘 기준으로 다시 맞춰볼게요.",
      changedItemIds: ["meal-1"],
      updatedTodayItems: [{ ...pendingMeal, status: "adjusted" }],
      createdAt: "2026-06-16T00:00:00.000Z",
      approvedAt: "2026-06-16T00:10:00.000Z",
    };

    expect(isPlanRevisionApproved(revision)).toBe(true);
  });
});
