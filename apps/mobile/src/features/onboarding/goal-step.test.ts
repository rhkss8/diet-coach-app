import { describe, expect, it } from "vitest";

import {
  canCompleteGoalSetupStep,
  createGoalInput,
  getTargetDateRange,
  initialGoalSetupDraft,
  normalizeGoalWeightInput,
  validateGoalSetupDraft,
} from "./goal-step";

const profile = {
  age: 34,
  sex: "female",
  heightCm: 164,
  currentWeightKg: 72,
} as const;

describe("goal setup step", () => {
  it("rejects empty goal values", () => {
    expect(canCompleteGoalSetupStep(initialGoalSetupDraft, profile)).toBe(false);
    expect(validateGoalSetupDraft(initialGoalSetupDraft, profile)).toEqual(
      expect.objectContaining({
        targetWeightKg: expect.any(String),
      }),
    );
  });

  it("allows the target date to be skipped", () => {
    const draft = {
      targetWeightKg: "66",
    };

    expect(validateGoalSetupDraft(draft, profile)).toEqual({});
    expect(createGoalInput(draft)).toEqual({
      targetWeightKg: 66,
    });
  });

  it("rejects a target weight that is not lower than the current weight", () => {
    expect(
      validateGoalSetupDraft(
        {
          targetWeightKg: "72",
          targetDate: "2026-09-16",
        },
        profile,
        new Date("2026-06-16T00:00:00"),
      ).targetWeightKg,
    ).toBeTruthy();
  });

  it("rejects a malformed selected target date", () => {
    expect(
      validateGoalSetupDraft(
        {
          targetWeightKg: "66",
          targetDate: "2026-02-31",
        },
        profile,
      ).targetDate,
    ).toBeTruthy();
  });

  it("rejects a target date outside the selectable range", () => {
    expect(
      validateGoalSetupDraft(
        {
          targetWeightKg: "66",
          targetDate: "2026-06-16",
        },
        profile,
        new Date("2026-06-16T00:00:00"),
      ).targetDate,
    ).toBeTruthy();
  });

  it("creates goal input from a valid draft", () => {
    expect(
      createGoalInput({
        targetWeightKg: "66",
        targetDate: "2026-09-16",
      }),
    ).toEqual({
      targetDate: "2026-09-16",
      targetWeightKg: 66,
    });
  });

  it("normalizes decimal target weight input", () => {
    expect(normalizeGoalWeightInput("a66.55kg")).toBe("66.5");
  });

  it("returns the selectable target date range", () => {
    const range = getTargetDateRange(new Date("2026-06-16T00:00:00"));

    expect(toLocalDateKey(range.minDate)).toBe("2026-06-17");
    expect(toLocalDateKey(range.maxDate)).toBe("2028-06-15");
  });
});

function toLocalDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}
