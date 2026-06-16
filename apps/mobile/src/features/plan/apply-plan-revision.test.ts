import { describe, expect, it } from "vitest";

import type { AdjustTodayPlanOutput, AiPlan } from "@diet-coach/ai";

import { applyPlanRevisionToPlan } from "./apply-plan-revision";

const plan = {
  id: "plan-1",
  goalId: "goal-1",
  startDate: "2026-06-16",
  endDate: "2026-06-22",
  summary: "7일 플랜",
  items: [
    {
      id: "breakfast-1",
      date: "2026-06-16",
      type: "meal",
      slot: "breakfast",
      title: "아침",
      description: "기존 아침",
    },
    {
      id: "dinner-1",
      date: "2026-06-16",
      type: "meal",
      slot: "dinner",
      title: "기존 저녁",
      description: "기존 저녁 설명",
    },
    {
      id: "dinner-2",
      date: "2026-06-17",
      type: "meal",
      slot: "dinner",
      title: "내일 저녁",
      description: "기존 내일 저녁",
    },
  ],
} satisfies AiPlan;

const revision = {
  planId: "plan-1",
  affectedDate: "2026-06-16",
  reason: "meal_changed",
  summary: "저녁 조정",
  userMessage: "남은 하루 기준으로 다시 맞춰볼게요.",
  changedItemIds: ["dinner-1", "dinner-2"],
  updatedTodayItems: [
    {
      id: "dinner-1",
      date: "2026-06-16",
      type: "meal",
      slot: "dinner",
      title: "가벼운 조정 저녁",
      description: "단백질과 채소 중심",
      status: "adjusted",
    },
  ],
  updatedFutureItems: [
    {
      id: "dinner-2",
      date: "2026-06-17",
      type: "meal",
      slot: "dinner",
      title: "내일 회복 저녁",
      description: "내일 부담을 낮춘 저녁",
      status: "adjusted",
    },
  ],
} satisfies AdjustTodayPlanOutput["revision"];

describe("applyPlanRevisionToPlan", () => {
  it("replaces today's and future plan items from an approved revision", () => {
    const updatedPlan = applyPlanRevisionToPlan(plan, revision);

    expect(updatedPlan.items).toEqual([
      plan.items[0],
      revision.updatedTodayItems[0],
      revision.updatedFutureItems?.[0],
    ]);
  });

  it("keeps the original plan immutable", () => {
    const updatedPlan = applyPlanRevisionToPlan(plan, revision);

    expect(updatedPlan).not.toBe(plan);
    expect(plan.items[1]?.title).toBe("기존 저녁");
  });
});
