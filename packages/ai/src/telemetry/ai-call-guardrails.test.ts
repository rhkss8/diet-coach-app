import { describe, expect, it } from "vitest";

import { initialFixtureUsers } from "../fixtures";
import { buildGenerateInitialPlanPrompt } from "../prompts";
import {
  createAiCallLog,
  estimateAiPromptUsage,
  getAiCallBudgetErrors,
  isAiCallWithinBudget,
} from "./ai-call-guardrails";

describe("AI call guardrails", () => {
  it("estimates prompt usage from prompt messages", () => {
    const prompt = buildGenerateInitialPlanPrompt(initialFixtureUsers[0].input);
    const usage = estimateAiPromptUsage(prompt, 1000);

    expect(usage.estimatedPromptTokens).toBeGreaterThan(0);
    expect(usage.requestedOutputTokens).toBe(1000);
  });

  it("passes calls that stay within the function budget", () => {
    expect(
      isAiCallWithinBudget("generateInitialPlan", {
        estimatedPromptTokens: 1200,
        requestedOutputTokens: 1000,
      }),
    ).toBe(true);
  });

  it("reports prompt and output budget errors", () => {
    expect(
      getAiCallBudgetErrors("adjustTodayPlan", {
        estimatedPromptTokens: 3000,
        requestedOutputTokens: 1500,
      }),
    ).toEqual([
      "adjustTodayPlan prompt estimate 3000 exceeds budget 2200",
      "adjustTodayPlan output token request 1500 exceeds budget 1200",
    ]);
  });

  it("creates a stable AI call log", () => {
    expect(
      createAiCallLog({
        createdAt: "2026-06-16T00:00:00.000Z",
        functionName: "adjustTodayPlan",
        model: "mvp-model",
        source: "fallback",
        usage: {
          estimatedPromptTokens: 1000,
          requestedOutputTokens: 800,
        },
        errors: ["AI response must be valid JSON"],
      }),
    ).toEqual({
      createdAt: "2026-06-16T00:00:00.000Z",
      errors: ["AI response must be valid JSON"],
      functionName: "adjustTodayPlan",
      model: "mvp-model",
      source: "fallback",
      usage: {
        estimatedPromptTokens: 1000,
        requestedOutputTokens: 800,
      },
    });
  });
});
