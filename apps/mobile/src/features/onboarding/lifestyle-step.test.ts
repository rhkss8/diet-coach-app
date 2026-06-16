import { describe, expect, it } from "vitest";

import { canCompleteLifestyleStep, initialLifestyleAnswers } from "./lifestyle-step";

describe("lifestyle step", () => {
  it("starts with a consistency-first default", () => {
    expect(initialLifestyleAnswers).toEqual({
      pace: "consistency_first",
      hardestPart: "meal",
      exerciseExperience: "none",
    });
  });

  it("is complete when all three lifestyle answers exist", () => {
    expect(canCompleteLifestyleStep(initialLifestyleAnswers)).toBe(true);
  });
});
