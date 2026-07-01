import { describe, expect, it } from "vitest";

import type { AiPlan } from "@diet-coach/ai";

import {
  canUpdatePlanItemStatusForDate,
  countPendingTodayItems,
  getInitialSelectedPlanDate,
  getDateMonthKey,
  getMonthCalendarDates,
  getPlanDateCursor,
  getPlanDateRelationLabel,
  getPlanDates,
  getPlanItemsForDate,
  getTodayPlanDate,
  getTodayPlanItems,
  getDailyProgressSummary,
  getPlanItemStatusEventName,
  getWeekCalendarDates,
  groupTodayPlanItemsByType,
  shouldTrackPlanItemCompletedAfterRevision,
  updatePlanItemStatus,
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

  it("returns plan items for a selected date", () => {
    expect(getPlanItemsForDate(plan, "2026-06-17")).toEqual([
      expect.objectContaining({ id: "breakfast-2" }),
    ]);
  });

  it("lists plan dates in order", () => {
    expect(getPlanDates(plan)).toEqual(["2026-06-16", "2026-06-17"]);
  });

  it("builds a Sunday-first week calendar around the selected date", () => {
    expect(getWeekCalendarDates("2026-06-17")).toEqual([
      "2026-06-14",
      "2026-06-15",
      "2026-06-16",
      "2026-06-17",
      "2026-06-18",
      "2026-06-19",
      "2026-06-20",
    ]);
  });

  it("builds a full month calendar grid including leading and trailing days", () => {
    const dates = getMonthCalendarDates("2026-06-17");

    expect(dates.at(0)).toBe("2026-05-31");
    expect(dates.at(-1)).toBe("2026-07-04");
    expect(dates).toHaveLength(35);
  });

  it("returns a stable month key for calendar cell dimming", () => {
    expect(getDateMonthKey("2026-06-17")).toBe("2026-06");
  });

  it("starts from the real today when the plan contains that date", () => {
    expect(getInitialSelectedPlanDate(plan, "2026-06-17")).toBe("2026-06-17");
  });

  it("falls back to the first plan date when the real today is outside the plan", () => {
    expect(getInitialSelectedPlanDate(plan, "2026-06-24")).toBe("2026-06-16");
  });

  it("returns previous and next date cursors", () => {
    expect(getPlanDateCursor(plan, "2026-06-16")).toEqual({
      nextDate: "2026-06-17",
      previousDate: undefined,
      selectedIndex: 0,
      totalCount: 2,
    });
  });

  it("labels date relation against the real today", () => {
    expect(getPlanDateRelationLabel("2026-06-16", "2026-06-17")).toBe("지난 플랜");
    expect(getPlanDateRelationLabel("2026-06-17", "2026-06-17")).toBe("오늘");
    expect(getPlanDateRelationLabel("2026-06-18", "2026-06-17")).toBe("예정 플랜");
  });

  it("allows status updates for past and today, not future plan dates", () => {
    expect(canUpdatePlanItemStatusForDate("2026-06-16", "2026-06-17")).toBe(true);
    expect(canUpdatePlanItemStatusForDate("2026-06-17", "2026-06-17")).toBe(true);
    expect(canUpdatePlanItemStatusForDate("2026-06-18", "2026-06-17")).toBe(false);
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

  it("updates a plan item status across the full plan", () => {
    expect(updatePlanItemStatus(plan, "breakfast-2", "completed").items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "breakfast-2",
          status: "completed",
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
