import { describe, expect, it } from "vitest";

import {
  canCompleteBasicProfileStep,
  createUserProfileInput,
  initialBasicProfileDraft,
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
});
