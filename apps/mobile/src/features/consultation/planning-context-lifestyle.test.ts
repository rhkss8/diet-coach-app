import { describe, expect, it } from "vitest";

import type { PlanningContext } from "@diet-coach/ai";

import { deriveLifestyleAnswersFromPlanningContext } from "./planning-context-lifestyle";

const basePlanningContext: PlanningContext = {
  foodContext: {
    allergies: [],
    avoidedFoods: [],
    foodsToKeep: [],
    preferredFoods: [],
  },
  managementIntent: {
    goalTypes: ["weight_loss"],
  },
  routineContext: {
    exerciseWindows: [],
    mealWindows: {},
    rawRoutineText: "8시 기상, 21시 퇴근",
    riskMoments: [],
  },
};

describe("deriveLifestyleAnswersFromPlanningContext", () => {
  it("uses a steady meal-focused basis for weight loss context", () => {
    expect(deriveLifestyleAnswersFromPlanningContext(basePlanningContext)).toEqual({
      exerciseExperience: "none",
      hardestPart: "meal",
      pace: "steady_6_months",
    });
  });

  it("keeps exercise intent when the user selected exercise methods", () => {
    expect(
      deriveLifestyleAnswersFromPlanningContext({
        ...basePlanningContext,
        managementIntent: {
          goalTypes: ["weight_loss"],
          preferredMethods: ["걷기", "홈트"],
        },
      }),
    ).toEqual({
      exerciseExperience: "some",
      hardestPart: "both",
      pace: "steady_6_months",
    });
  });
});
