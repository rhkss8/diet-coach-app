import type { AiPlan, AiPlanItem } from "@diet-coach/ai";
import type { PlanItemStatus } from "@diet-coach/core";

export function getTodayPlanDate(plan: AiPlan) {
  return plan.items[0]?.date ?? plan.startDate;
}

export function getTodayPlanItems(plan: AiPlan) {
  const todayPlanDate = getTodayPlanDate(plan);

  return plan.items.filter((planItem) => planItem.date === todayPlanDate);
}

export function countPendingTodayItems(planItems: AiPlanItem[]) {
  return planItems.filter((planItem) => planItem.status !== "completed").length;
}

export function groupTodayPlanItemsByType(planItems: AiPlanItem[]) {
  return {
    exercises: planItems.filter((planItem) => planItem.type === "exercise"),
    meals: planItems.filter((planItem) => planItem.type === "meal"),
  };
}

export function updateTodayPlanItemStatus(
  planItems: AiPlanItem[],
  planItemId: string,
  status: PlanItemStatus,
) {
  return planItems.map((planItem) =>
    planItem.id === planItemId
      ? {
          ...planItem,
          status,
        }
      : planItem,
  );
}
