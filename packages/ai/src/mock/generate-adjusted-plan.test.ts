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
});
