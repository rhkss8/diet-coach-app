import { describe, expect, it } from "vitest";

import { getAdjustmentReasonOptions } from "./adjustment-reason";

describe("adjustment reason options", () => {
  it("uses the four MVP adjustment reasons", () => {
    expect(getAdjustmentReasonOptions().map((option) => option.value)).toEqual([
      "meal_changed",
      "missed_exercise",
      "schedule_changed",
      "want_replan",
    ]);
  });

  it("keeps labels user-facing", () => {
    expect(getAdjustmentReasonOptions().map((option) => option.label)).toEqual([
      "식사를 다르게 했어요",
      "운동을 못 했어요",
      "일정이 바뀌었어요",
      "그냥 다시 맞추고 싶어요",
    ]);
  });
});
