import { describe, expect, it } from "vitest";

import {
  canCompleteGoalSetupStep,
  createGoalInput,
  initialGoalSetupDraft,
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
        targetDate: expect.any(String),
        targetWeightKg: expect.any(String),
      }),
    );
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
});
