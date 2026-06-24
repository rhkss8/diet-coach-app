import { describe, expect, it } from "vitest";

import {
  canSavePlanBasisDraft,
  createPlanBasis,
  createPlanBasisDraft,
  initialPlanBasisDraft,
  validatePlanBasisDraft,
} from "./plan-basis";

describe("plan basis", () => {
  it("requires basic body and target values before first plan generation", () => {
    expect(canSavePlanBasisDraft(initialPlanBasisDraft)).toBe(false);
    expect(validatePlanBasisDraft(initialPlanBasisDraft)).toEqual(
      expect.objectContaining({
        age: "나이는 숫자만 입력해주세요.",
        currentWeightKg: "현재 체중은 숫자만 입력해주세요.",
        heightCm: "키는 숫자만 입력해주세요.",
        targetWeightKg: "목표 체중은 숫자만 입력해주세요.",
      }),
    );
  });

  it("creates the initial plan input basis from valid draft values", () => {
    expect(
      createPlanBasis({
        age: "34",
        currentWeightKg: "72.5",
        heightCm: "164",
        name: "테스터",
        sex: "prefer_not_to_say",
        targetDate: "2026-09-24",
        targetWeightKg: "66",
      }),
    ).toEqual({
      goal: {
        targetDate: "2026-09-24",
        targetWeightKg: 66,
      },
      profile: {
        age: 34,
        currentWeightKg: 72.5,
        heightCm: 164,
        name: "테스터",
        sex: "prefer_not_to_say",
      },
    });
  });

  it("round-trips existing plan basis into a settings draft", () => {
    expect(
      createPlanBasisDraft({
        goal: {
          targetWeightKg: 66,
        },
        profile: {
          age: 34,
          currentWeightKg: 72.5,
          heightCm: 164,
          sex: "female",
        },
      }),
    ).toEqual({
      age: "34",
      currentWeightKg: "72.5",
      heightCm: "164",
      name: "",
      sex: "female",
      targetDate: "",
      targetWeightKg: "66",
    });
  });
});
