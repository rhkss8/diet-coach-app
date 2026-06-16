import { describe, expect, it } from "vitest";

import { adjustmentFixtureCases, initialFixtureUsers } from "../fixtures";
import { generateMockInitialPlan } from "../mock";
import {
  parseAdjustTodayPlanResponse,
  parseGenerateInitialPlanResponse,
} from "./parse-ai-response";

describe("AI response parsing", () => {
  it("parses and validates an initial plan response", () => {
    const output = generateMockInitialPlan(initialFixtureUsers[0].input);
    const result = parseGenerateInitialPlanResponse(JSON.stringify(output));

    expect(result.ok).toBe(true);
  });

  it("rejects invalid JSON before validation", () => {
    const result = parseGenerateInitialPlanResponse("not json");

    expect(result).toEqual({
      ok: false,
      errors: ["AI response must be valid JSON"],
    });
  });

  it("rejects non-object JSON before validation", () => {
    const result = parseGenerateInitialPlanResponse("[]");

    expect(result).toEqual({
      ok: false,
      errors: ["AI response must be a JSON object"],
    });
  });

  it("returns contract errors for invalid initial plan shape", () => {
    const result = parseGenerateInitialPlanResponse(
      JSON.stringify({
        plan: {
          goalId: "goal-1",
          startDate: "2026-06-16",
          endDate: "2026-06-22",
          summary: "계획",
          items: [],
        },
        rationale: "",
        userMessage: "이번엔 실패하지 마세요.",
        adjustmentNotes: [],
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error("Expected invalid initial plan response");
    }
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "plan.items must include at least 1 item(s)",
        "rationale must be a non-empty string",
        "userMessage contains banned coaching copy: 실패",
      ]),
    );
  });

  it("parses and validates an adjustment response", () => {
    const result = parseAdjustTodayPlanResponse(
      JSON.stringify(adjustmentFixtureCases[0].sampleOutput),
    );

    expect(result.ok).toBe(true);
  });
});
