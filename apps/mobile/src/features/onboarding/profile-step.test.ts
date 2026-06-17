import { describe, expect, it } from "vitest";

import {
  canCompleteBasicProfileStep,
  createUserProfileInput,
  initialBasicProfileDraft,
  normalizeDecimalInput,
  normalizeIntegerInput,
  validateBasicProfileDraft,
} from "./profile-step";

describe("basic profile step", () => {
  it("rejects empty profile values", () => {
    expect(canCompleteBasicProfileStep(initialBasicProfileDraft)).toBe(false);
    expect(validateBasicProfileDraft(initialBasicProfileDraft)).toEqual(
      expect.objectContaining({
        age: expect.any(String),
        heightCm: expect.any(String),
        currentWeightKg: expect.any(String),
      }),
    );
  });

  it("creates user profile input from a valid draft", () => {
    expect(
      createUserProfileInput({
        name: "민지",
        age: "34",
        sex: "female",
        heightCm: "164",
        currentWeightKg: "72",
      }),
    ).toEqual({
      name: "민지",
      age: 34,
      sex: "female",
      heightCm: 164,
      currentWeightKg: 72,
    });
  });

  it("rejects non-numeric profile drafts", () => {
    expect(
      validateBasicProfileDraft({
        name: "",
        age: "34세",
        sex: "prefer_not_to_say",
        heightCm: "170cm",
        currentWeightKg: "72kg",
      }),
    ).toEqual(
      expect.objectContaining({
        age: expect.any(String),
        heightCm: expect.any(String),
        currentWeightKg: expect.any(String),
      }),
    );
  });

  it("normalizes integer and decimal inputs before storing drafts", () => {
    expect(normalizeIntegerInput("3a4")).toBe("34");
    expect(normalizeDecimalInput("72..55kg")).toBe("72.5");
  });
});
