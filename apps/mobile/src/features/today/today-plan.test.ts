import { describe, expect, it } from "vitest";

import type { AiPlan } from "@diet-coach/ai";

import {
  countPendingTodayItems,
  getTodayPlanDate,
  getTodayPlanItems,
  groupTodayPlanItemsByType,
} from "./today-plan";

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
      status: "completed",
    },
    {
      date: "2026-06-16",
      type: "exercise",
      slot: "workout",
      title: "산책",
      description: "15분 걷기",
      status: "pending",
    },
    {
      date: "2026-06-17",
      type: "meal",
      slot: "breakfast",
      title: "다음 날 아침",
      description: "간단히 시작",
      status: "pending",
    },
  ],
} satisfies AiPlan;

describe("today plan helpers", () => {
  it("uses the first plan item date as today", () => {
    expect(getTodayPlanDate(plan)).toBe("2026-06-16");
  });

  it("returns today's plan items", () => {
    expect(getTodayPlanItems(plan)).toHaveLength(2);
  });

  it("counts pending today items", () => {
    expect(countPendingTodayItems(getTodayPlanItems(plan))).toBe(1);
  });

  it("groups today's meals and exercise", () => {
    expect(groupTodayPlanItemsByType(getTodayPlanItems(plan))).toEqual({
      exercises: [expect.objectContaining({ type: "exercise" })],
      meals: [expect.objectContaining({ type: "meal" })],
    });
  });
});
