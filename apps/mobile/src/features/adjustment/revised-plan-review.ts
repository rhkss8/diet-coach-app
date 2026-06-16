import type { AdjustTodayPlanOutput, AiPlanItem } from "@diet-coach/ai";

export function getChangedTodayItems(revision: AdjustTodayPlanOutput["revision"]) {
  const changedItemIdSet = new Set(revision.changedItemIds);

  return revision.updatedTodayItems.filter((planItem) => changedItemIdSet.has(planItem.id ?? ""));
}

export function countChangedTodayItems(planItems: AiPlanItem[]) {
  return planItems.length;
}
