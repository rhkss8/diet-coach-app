import type { AiPlan, AiPlanItem } from "@diet-coach/ai";

export function getFirstPlanDate(plan: AiPlan) {
  return plan.items[0]?.date ?? plan.startDate;
}

export function getPlanItemsForFirstDay(plan: AiPlan) {
  const firstPlanDate = getFirstPlanDate(plan);

  return plan.items.filter((planItem) => planItem.date === firstPlanDate);
}

export function countPlanItemsByType(planItems: AiPlanItem[]) {
  return planItems.reduce(
    (counts, planItem) => ({
      ...counts,
      [planItem.type]: counts[planItem.type] + 1,
    }),
    {
      exercise: 0,
      meal: 0,
    },
  );
}
