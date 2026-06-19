import { describe, expect, it } from "vitest";

import type { AdjustTodayPlanOutput } from "@diet-coach/ai";

import {
  countChangedTodayItems,
  getChangeBadgeLabel,
  getChangedTodayItems,
} from "./revised-plan-review";

const output = {
  revision: {
    planId: "plan-1",
    affectedDate: "2026-06-16",
    reason: "meal_changed",
    summary: "저녁 조정",
    userMessage: "남은 하루 기준으로 다시 맞춰볼게요.",
    changedItemIds: ["dinner-1"],
    updatedTodayItems: [
      {
        id: "dinner-1",
        date: "2026-06-16",
        type: "meal",
        slot: "dinner",
        title: "가벼운 저녁",
        description: "단백질과 채소 중심",
        status: "adjusted",
      },
      {
        id: "workout-1",
        date: "2026-06-16",
        type: "exercise",
        slot: "workout",
        title: "산책",
        description: "10분 걷기",
        status: "pending",
      },
    ],
  },
} satisfies AdjustTodayPlanOutput;

describe("revised plan review", () => {
  it("returns changed today items", () => {
    expect(getChangedTodayItems(output.revision)).toEqual([
      expect.objectContaining({
        id: "dinner-1",
      }),
    ]);
  });

  it("shows only one comparison row per changed type and slot", () => {
    const changedItems = getChangedTodayItems({
      ...output.revision,
      changedItemIds: ["walk-1", "stretch-1"],
      updatedTodayItems: [
        {
          id: "walk-1",
          date: "2026-06-16",
          type: "exercise",
          slot: "workout",
          title: "산책",
          description: "10분 걷기",
          status: "adjusted",
        },
        {
          id: "stretch-1",
          date: "2026-06-16",
          type: "exercise",
          slot: "workout",
          title: "스트레칭",
          description: "취침 전",
          status: "adjusted",
        },
      ],
    });

    expect(changedItems).toEqual([
      expect.objectContaining({
        id: "walk-1",
      }),
    ]);
  });

  it("counts changed items", () => {
    expect(countChangedTodayItems(getChangedTodayItems(output.revision))).toBe(1);
  });

  it("labels meal and workout changes like the Figma Make approval badges", () => {
    expect(getChangeBadgeLabel(output.revision.updatedTodayItems[0])).toBe("새로 추가");
    expect(
      getChangeBadgeLabel({
        id: "workout-1",
        date: "2026-06-16",
        type: "exercise",
        slot: "workout",
        title: "산책",
        description: "내일 오전으로 이동",
        status: "adjusted",
      }),
    ).toBe("이동");
  });
});
