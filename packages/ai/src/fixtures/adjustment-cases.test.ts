import { describe, expect, it } from "vitest";

import { validateAdjustTodayPlanOutput } from "../contracts";
import { adjustmentFixtureCases, getAdjustmentFixtureCase } from "./adjustment-cases";

describe("adjustment fixture cases", () => {
  it("covers every required MVP adjustment scenario", () => {
    expect(adjustmentFixtureCases.map((fixtureCase) => fixtureCase.id)).toEqual([
      "heavy-lunch-adjust-dinner",
      "missed-workout-adjust-tomorrow",
      "schedule-changed-late-work",
      "wants-gentler-plan",
      "skipped-breakfast-recover-day",
      "normal-lunch-protect-social-meal",
    ]);
  });

  it("keeps sample outputs renderable by the app contract", () => {
    for (const fixtureCase of adjustmentFixtureCases) {
      const validation = validateAdjustTodayPlanOutput(fixtureCase.sampleOutput);

      expect(validation.ok, fixtureCase.id).toBe(true);
    }
  });

  it("keeps every fixture tied to the same requested plan and date", () => {
    for (const fixtureCase of adjustmentFixtureCases) {
      expect(fixtureCase.input.request.planId).toBe("plan-fixture-1");
      expect(fixtureCase.input.request.affectedDate).toBe("2026-06-16");
      expect(fixtureCase.input.currentPlan.id).toBe("plan-fixture-1");
      expect(fixtureCase.sampleOutput.revision.planId).toBe("plan-fixture-1");
    }
  });

  it("finds a fixture by id", () => {
    expect(getAdjustmentFixtureCase("wants-gentler-plan")?.input.request.reason).toBe(
      "want_replan",
    );
  });
});
