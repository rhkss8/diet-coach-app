import { describe, expect, it } from "vitest";

import { adjustmentFixtureCases } from "../fixtures";
import { buildAdjustTodayPlanPrompt } from "./adjust-today-plan-prompt";

describe("buildAdjustTodayPlanPrompt", () => {
  it("builds a JSON-only prompt for plan adjustment", () => {
    const prompt = buildAdjustTodayPlanPrompt(adjustmentFixtureCases[0].input);

    expect(prompt.responseFormat).toEqual({ type: "json_object" });
    expect(prompt.messages[0]?.content).toContain("Return JSON only");
    expect(prompt.messages[0]?.content).toContain("proposed PlanRevision only");
    expect(prompt.messages[0]?.content).toContain("manually asked for adjustment");
  });

  it("includes current plan context and revision output contract", () => {
    const fixtureCase = adjustmentFixtureCases[1];
    const prompt = buildAdjustTodayPlanPrompt(fixtureCase.input);
    const userMessage = prompt.messages[1]?.content ?? "";

    expect(userMessage).toContain('"task": "adjustTodayPlan"');
    expect(userMessage).toContain(fixtureCase.input.currentPlan.summary);
    expect(userMessage).toContain('"changedItemIds"');
    expect(userMessage).toContain('"updatedTodayItems"');
    expect(userMessage).toContain('"updatedFutureItems"');
  });

  it("keeps food context rough and waits for user approval", () => {
    const prompt = buildAdjustTodayPlanPrompt(adjustmentFixtureCases[0].input);
    const promptText = prompt.messages.map((message) => message.content).join("\n");

    expect(promptText).toContain("rough context");
    expect(promptText).toContain("Do not present precise calorie judgment");
    expect(promptText).toContain("persist the revision only after the user approves it");
  });
});
