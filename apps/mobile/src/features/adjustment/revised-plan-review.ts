import type { AdjustTodayPlanOutput, AiPlanItem } from "@diet-coach/ai";

export function getChangedTodayItems(revision: AdjustTodayPlanOutput["revision"]) {
  const changedItemIdSet = new Set(revision.changedItemIds);

  return revision.updatedTodayItems.filter((planItem) => changedItemIdSet.has(planItem.id ?? ""));
}

export function countChangedTodayItems(planItems: AiPlanItem[]) {
  return planItems.length;
}

export function getChangeBadgeLabel(planItem: AiPlanItem) {
  return planItem.type === "exercise" || planItem.slot === "workout" ? "이동" : "새로 추가";
}
