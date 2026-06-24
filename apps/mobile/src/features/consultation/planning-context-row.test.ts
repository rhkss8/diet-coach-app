import { describe, expect, it } from "vitest";

import {
  createEmptyPlanningContextDraft,
  createPlanningContextFromDraft,
} from "./planning-context";
import { toPlanningContextRow } from "./planning-context-row";

describe("planning context row", () => {
  it("maps planning context into the Supabase upsert row", () => {
    const context = createPlanningContextFromDraft({
      ...createEmptyPlanningContextDraft(),
      avoidedFoodsText: "우유",
      goalTypes: ["weight_loss"],
      preferredFoodsText: "라면",
      routineText: "8시 기상, 12시 점심, 21시 퇴근",
    });

    expect(toPlanningContextRow(context, "user-1", "2026-06-24T00:00:00.000Z")).toEqual({
      food_context: {
        allergies: [],
        avoidedFoods: ["우유"],
        eatingContext: [],
        foodsToKeep: [],
        preferredFoods: ["라면"],
      },
      management_intent: {
        goalTypes: ["weight_loss"],
        preferredMethods: [],
        reasonText: undefined,
      },
      routine_context: {
        exerciseWindows: [],
        mealWindows: {},
        rawRoutineText: "8시 기상, 12시 점심, 21시 퇴근",
        riskMoments: [],
        wakeTime: undefined,
        workEndTime: undefined,
      },
      updated_at: "2026-06-24T00:00:00.000Z",
      user_id: "user-1",
    });
  });
});
