import { describe, expect, it } from "vitest";

import type { AiPlanItem } from "@diet-coach/ai";

import { getPlanItemFoodLines, getPlanItemNutritionSummary } from "./plan-item-display";

const breakfastItem = {
  date: "2026-06-16",
  type: "meal",
  slot: "breakfast",
  title: "호두 계란 단백질 쉐이크",
  description: "오전 8시 · 앱 기준 추정치",
  foods: [
    { name: "호두", amount: "2알" },
    { name: "삶은 계란", amount: "2개" },
    { name: "단백질 음료", amount: "1병" },
  ],
  nutrition: {
    caloriesKcal: 373,
    proteinG: 34,
    carbsG: 12,
    fatG: 21,
    source: "estimated",
    confidence: "medium",
  },
} satisfies AiPlanItem;

describe("plan item display helpers", () => {
  it("formats estimated nutrition summary for plan cards", () => {
    expect(getPlanItemNutritionSummary(breakfastItem)).toBe(
      "373kcal · 단백질 34g · 탄수화물 12g · 지방 21g",
    );
  });

  it("formats food composition lines", () => {
    expect(getPlanItemFoodLines(breakfastItem)).toEqual([
      "호두 2알",
      "삶은 계란 2개",
      "단백질 음료 1병",
    ]);
  });

  it("keeps legacy items renderable without nutrition fields", () => {
    expect(
      getPlanItemNutritionSummary({
        date: "2026-06-16",
        type: "meal",
        slot: "breakfast",
        title: "아침",
        description: "가볍게 시작",
      }),
    ).toBeUndefined();
  });
});
