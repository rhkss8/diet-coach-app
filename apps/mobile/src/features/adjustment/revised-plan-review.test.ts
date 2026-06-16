import { describe, expect, it } from "vitest";

import type { AdjustTodayPlanOutput } from "@diet-coach/ai";

import { countChangedTodayItems, getChangedTodayItems } from "./revised-plan-review";

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

  it("counts changed items", () => {
    expect(countChangedTodayItems(getChangedTodayItems(output.revision))).toBe(1);
  });
});
