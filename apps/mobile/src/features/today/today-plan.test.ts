import { describe, expect, it } from "vitest";

import type { AiPlan } from "@diet-coach/ai";

import {
  countPendingTodayItems,
  getTodayPlanDate,
  getTodayPlanItems,
  getDailyProgressSummary,
  getPlanItemStatusEventName,
  groupTodayPlanItemsByType,
  shouldTrackPlanItemCompletedAfterRevision,
  updateTodayPlanItemStatus,
} from "./today-plan";

const plan = {
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
      description: "가볍게 시작",
      status: "completed",
    },
    {
      id: "workout-1",
      date: "2026-06-16",
      type: "exercise",
      slot: "workout",
      title: "산책",
      description: "15분 걷기",
      status: "pending",
    },
    {
      id: "breakfast-2",
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

  it("updates a plan item status by id", () => {
    expect(updateTodayPlanItemStatus(getTodayPlanItems(plan), "workout-1", "skipped")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "workout-1",
          status: "skipped",
        }),
      ]),
    );
  });

  it("summarizes daily progress", () => {
    expect(getDailyProgressSummary(getTodayPlanItems(plan))).toEqual({
      completedCount: 1,
      completionRate: 50,
      pendingCount: 1,
      skippedCount: 0,
      totalCount: 2,
    });
  });

  it("maps status changes to analytics events", () => {
    expect(getPlanItemStatusEventName("completed")).toBe("PLAN_ITEM_COMPLETED");
    expect(getPlanItemStatusEventName("skipped")).toBe("PLAN_ITEM_SKIPPED");
    expect(getPlanItemStatusEventName("pending")).toBeNull();
  });

  it("tracks after-revision completion only for revised completed items", () => {
    expect(shouldTrackPlanItemCompletedAfterRevision("workout-1", "completed", ["workout-1"])).toBe(
      true,
    );
    expect(shouldTrackPlanItemCompletedAfterRevision("workout-1", "skipped", ["workout-1"])).toBe(
      false,
    );
    expect(shouldTrackPlanItemCompletedAfterRevision("breakfast-1", "completed", [])).toBe(false);
  });
});
