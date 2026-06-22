import { describe, expect, it } from "vitest";

import { initialFixtureUsers } from "../fixtures";
import { buildGenerateInitialPlanPrompt } from "./generate-initial-plan-prompt";

describe("buildGenerateInitialPlanPrompt", () => {
  it("builds a JSON-only prompt for initial plan generation", () => {
    const prompt = buildGenerateInitialPlanPrompt(initialFixtureUsers[0].input);

    expect(prompt.responseFormat).toEqual({ type: "json_object" });
    expect(prompt.messages).toEqual([
      expect.objectContaining({ role: "system" }),
      expect.objectContaining({ role: "user" }),
    ]);
    expect(prompt.messages[0]?.content).toContain("Return JSON only");
    expect(prompt.messages[0]?.content).toContain("recovery-first diet planner");
  });

  it("includes input and renderable output contract terms", () => {
    const fixtureUser = initialFixtureUsers[1];
    const prompt = buildGenerateInitialPlanPrompt(fixtureUser.input);
    const userMessage = prompt.messages[1]?.content ?? "";

    expect(userMessage).toContain('"task": "generateInitialPlan"');
    expect(userMessage).toContain(`"targetWeightKg": ${fixtureUser.input.goal.targetWeightKg}`);
    expect(userMessage).toContain('"items"');
    expect(userMessage).toContain('"nutrition"');
    expect(userMessage).toContain('"foods"');
    expect(userMessage).toContain("breakfast | lunch | dinner | snack | workout");
    expect(userMessage).toContain("Return at least 7 dates of plan items.");
  });

  it("keeps recovery tone and safety rules in the prompt", () => {
    const prompt = buildGenerateInitialPlanPrompt(initialFixtureUsers[2].input);
    const promptText = prompt.messages.map((message) => message.content).join("\n");

    expect(promptText).toContain("Do not shame the user");
    expect(promptText).toContain("not a medical diagnosis tool");
    expect(promptText).toContain("not a precise calorie tracker");
    expect(promptText).toContain("app-level estimates");
    expect(promptText).toContain("easy to adjust later");
  });
});
