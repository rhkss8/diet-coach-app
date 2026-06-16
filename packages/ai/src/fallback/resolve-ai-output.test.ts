import { describe, expect, it } from "vitest";

import { adjustmentFixtureCases, initialFixtureUsers } from "../fixtures";
import { generateMockAdjustedPlan, generateMockInitialPlan } from "../mock";
import {
  resolveAdjustTodayPlanOutput,
  resolveGenerateInitialPlanOutput,
} from "./resolve-ai-output";

describe("AI output fallback resolution", () => {
  it("uses validated AI initial plan output when the response is valid", () => {
    const input = initialFixtureUsers[0].input;
    const output = generateMockInitialPlan(input);
    const resolution = resolveGenerateInitialPlanOutput(JSON.stringify(output), input);

    expect(resolution).toEqual({
      output,
      source: "ai",
      errors: [],
    });
  });

  it("falls back to a safe initial plan when the response is invalid", () => {
    const input = initialFixtureUsers[1].input;
    const resolution = resolveGenerateInitialPlanOutput("not json", input);

    expect(resolution.source).toBe("fallback");
    expect(resolution.errors).toEqual(["AI response must be valid JSON"]);
    expect(resolution.output.plan.items.length).toBeGreaterThan(0);
  });

  it("uses validated AI adjustment output when the response is valid", () => {
    const input = adjustmentFixtureCases[0].input;
    const output = adjustmentFixtureCases[0].sampleOutput;
    const resolution = resolveAdjustTodayPlanOutput(JSON.stringify(output), input);

    expect(resolution).toEqual({
      output,
      source: "ai",
      errors: [],
    });
  });

  it("falls back to a safe adjustment when the response fails contract validation", () => {
    const input = adjustmentFixtureCases[1].input;
    const resolution = resolveAdjustTodayPlanOutput(
      JSON.stringify({
        revision: {
          planId: "plan-fixture-1",
          affectedDate: "2026-06-16",
          reason: "missed_exercise",
          summary: "조정",
          userMessage: "이번엔 실패하지 마세요.",
          changedItemIds: [],
          updatedTodayItems: [],
        },
      }),
      input,
    );

    expect(resolution.source).toBe("fallback");
    expect(resolution.errors).toEqual(
      expect.arrayContaining([
        "revision.changedItemIds must include at least 1 item(s)",
        "revision.updatedTodayItems must include at least 1 item(s)",
        "revision.userMessage contains banned coaching copy: 실패",
      ]),
    );
    expect(resolution.output).toEqual(generateMockAdjustedPlan(input));
  });
});
