import type { AdjustTodayPlanOutput, AiPlan, AiPlanItem } from "@diet-coach/ai";

export function applyPlanRevisionToPlan(
  plan: AiPlan,
  revision: AdjustTodayPlanOutput["revision"],
): AiPlan {
  const revisionItemsById = createRevisionItemsById([
    ...revision.updatedTodayItems,
    ...(revision.updatedFutureItems ?? []),
  ]);

  return {
    ...plan,
    items: plan.items.map((planItem) => revisionItemsById.get(planItem.id ?? "") ?? planItem),
  };
}

function createRevisionItemsById(planItems: AiPlanItem[]) {
  return new Map(planItems.filter(hasPlanItemId).map((planItem) => [planItem.id, planItem]));
}

function hasPlanItemId(planItem: AiPlanItem): planItem is AiPlanItem & { id: string } {
  return Boolean(planItem.id);
}
