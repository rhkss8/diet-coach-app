import { describe, expect, it } from "vitest";

import { validateGenerateInitialPlanOutput } from "../contracts";
import { initialFixtureUsers } from "../fixtures";
import { generateMockInitialPlan } from "./generate-initial-plan";

describe("generateMockInitialPlan", () => {
  it("generates a renderable 7-day plan", () => {
    const output = generateMockInitialPlan(initialFixtureUsers[0].input, "2026-06-16");
    const validation = validateGenerateInitialPlanOutput(output);

    expect(validation.ok).toBe(true);
    expect(output.plan.startDate).toBe("2026-06-16");
    expect(output.plan.endDate).toBe("2026-06-22");
    expect(output.plan.items).toHaveLength(42);
  });

  it("keeps beginner exercise plans light", () => {
    const beginnerUser = initialFixtureUsers.find(
      (fixtureUser) => fixtureUser.id === "exercise-beginner-night-worker",
    );

    if (!beginnerUser) {
      throw new Error("Expected exercise beginner fixture");
    }

    const output = generateMockInitialPlan(beginnerUser.input, "2026-06-16");

    expect(output.plan.items.filter((item) => item.type === "exercise")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          intensity: "light",
        }),
      ]),
    );
  });
});
