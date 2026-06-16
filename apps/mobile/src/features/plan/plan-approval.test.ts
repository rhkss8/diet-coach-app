import { describe, expect, it } from "vitest";

import type { AiPlan } from "@diet-coach/ai";

import { countPlanItemsByType, getFirstPlanDate, getPlanItemsForFirstDay } from "./plan-approval";

const plan = {
  goalId: "goal-1",
  startDate: "2026-06-16",
  endDate: "2026-06-22",
  summary: "7일 플랜",
  items: [
    {
      date: "2026-06-16",
      type: "meal",
      slot: "breakfast",
      title: "아침",
      description: "가볍게 시작",
    },
    {
      date: "2026-06-16",
      type: "exercise",
      slot: "workout",
      title: "산책",
      description: "15분 걷기",
    },
    {
      date: "2026-06-17",
      type: "meal",
      slot: "breakfast",
      title: "다음 날 아침",
      description: "간단히 시작",
    },
  ],
} satisfies AiPlan;

describe("plan approval helpers", () => {
  it("finds the first plan date from plan items", () => {
    expect(getFirstPlanDate(plan)).toBe("2026-06-16");
  });

  it("returns only the first day items", () => {
    expect(getPlanItemsForFirstDay(plan)).toHaveLength(2);
  });

  it("counts meal and exercise items", () => {
    expect(countPlanItemsByType(plan.items)).toEqual({
      exercise: 1,
      meal: 2,
    });
  });
});
