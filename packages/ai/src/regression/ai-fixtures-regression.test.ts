import { describe, expect, it } from "vitest";

import {
  parseAdjustTodayPlanResponse,
  parseGenerateInitialPlanResponse,
  validateAdjustTodayPlanOutput,
  validateGenerateInitialPlanOutput,
} from "../contracts";
import { resolveAdjustTodayPlanOutput, resolveGenerateInitialPlanOutput } from "../fallback";
import { adjustmentFixtureCases, initialFixtureUsers } from "../fixtures";
import { generateMockAdjustedPlan, generateMockInitialPlan } from "../mock";
import { buildAdjustTodayPlanPrompt, buildGenerateInitialPlanPrompt } from "../prompts";

describe("AI fixture regression", () => {
  it("keeps every initial fixture compatible with prompt, mock, parser, and fallback", () => {
    for (const fixtureUser of initialFixtureUsers) {
      const prompt = buildGenerateInitialPlanPrompt(fixtureUser.input);
      const output = generateMockInitialPlan(fixtureUser.input);
      const validation = validateGenerateInitialPlanOutput(output);
      const parsed = parseGenerateInitialPlanResponse(JSON.stringify(output));
      const fallback = resolveGenerateInitialPlanOutput("invalid json", fixtureUser.input);

      expect(prompt.messages[1]?.content, fixtureUser.id).toContain(
        fixtureUser.input.goal.targetDate,
      );
      expect(validation.ok, fixtureUser.id).toBe(true);
      expect(parsed.ok, fixtureUser.id).toBe(true);
      expect(fallback.source, fixtureUser.id).toBe("fallback");
      expect(fallback.output.plan.items.length, fixtureUser.id).toBeGreaterThan(0);
    }
  });

  it("keeps every adjustment fixture compatible with prompt, sample output, parser, and fallback", () => {
    for (const fixtureCase of adjustmentFixtureCases) {
      const prompt = buildAdjustTodayPlanPrompt(fixtureCase.input);
      const validation = validateAdjustTodayPlanOutput(fixtureCase.sampleOutput);
      const parsed = parseAdjustTodayPlanResponse(JSON.stringify(fixtureCase.sampleOutput));
      const fallback = resolveAdjustTodayPlanOutput("invalid json", fixtureCase.input);

      expect(prompt.messages[1]?.content, fixtureCase.id).toContain(
        fixtureCase.input.request.reason,
      );
      expect(validation.ok, fixtureCase.id).toBe(true);
      expect(parsed.ok, fixtureCase.id).toBe(true);
      expect(fallback.source, fixtureCase.id).toBe("fallback");
      expect(fallback.output.revision.updatedTodayItems.length, fixtureCase.id).toBeGreaterThan(0);
    }
  });

  it("keeps generated adjustment mocks valid for every fixture input", () => {
    for (const fixtureCase of adjustmentFixtureCases) {
      const output = generateMockAdjustedPlan(fixtureCase.input);
      const validation = validateAdjustTodayPlanOutput(output);

      expect(validation.ok, fixtureCase.id).toBe(true);
    }
  });
});
