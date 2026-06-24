import type { PlanningContext } from "@diet-coach/ai";

export type PlanningContextRow = {
  food_context: PlanningContext["foodContext"];
  management_intent: PlanningContext["managementIntent"];
  routine_context: PlanningContext["routineContext"];
  updated_at: string;
  user_id: string;
};

export function toPlanningContextRow(
  context: PlanningContext,
  userId: string,
  updatedAt: string = new Date().toISOString(),
): PlanningContextRow {
  return {
    food_context: context.foodContext,
    management_intent: context.managementIntent,
    routine_context: context.routineContext,
    updated_at: updatedAt,
    user_id: userId,
  };
}
