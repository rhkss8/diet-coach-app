import { describe, expect, it } from "vitest";

import { validateAdjustTodayPlanOutput } from "../contracts";
import { adjustmentFixtureCases } from "../fixtures";
import { generateMockAdjustedPlan } from "./generate-adjusted-plan";

describe("generateMockAdjustedPlan", () => {
  it("generates a valid adjustment output for fixture cases", () => {
    for (const fixtureCase of adjustmentFixtureCases) {
      const output = generateMockAdjustedPlan(fixtureCase.input);
      const validation = validateAdjustTodayPlanOutput(output);

      expect(validation.ok, fixtureCase.id).toBe(true);
      expect(output.revision.changedItemIds.length, fixtureCase.id).toBeGreaterThan(0);
    }
  });

  it("targets workout when exercise was missed", () => {
    const fixtureCase = adjustmentFixtureCases.find(
      (candidate) => candidate.id === "missed-workout-adjust-tomorrow",
    );

    if (!fixtureCase) {
      throw new Error("Expected missed workout fixture");
    }

    const output = generateMockAdjustedPlan(fixtureCase.input);

    expect(output.revision.updatedTodayItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slot: "workout",
          status: "adjusted",
        }),
      ]),
    );
  });

  it("keeps adjusted dinner nutrition renderable", () => {
    const fixtureCase = adjustmentFixtureCases.find(
      (candidate) => candidate.id === "heavy-lunch-adjust-dinner",
    );

    if (!fixtureCase) {
      throw new Error("Expected meal changed fixture");
    }

    const output = generateMockAdjustedPlan(fixtureCase.input);

    expect(output.revision.updatedTodayItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slot: "dinner",
          status: "adjusted",
          foods: expect.arrayContaining([expect.objectContaining({ name: "두부" })]),
          nutrition: expect.objectContaining({
            caloriesKcal: 413,
            proteinG: 33,
          }),
        }),
      ]),
    );
  });
});
