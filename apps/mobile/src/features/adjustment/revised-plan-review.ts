import type { AdjustTodayPlanOutput, AiPlanItem } from "@diet-coach/ai";

export function getChangedTodayItems(revision: AdjustTodayPlanOutput["revision"]) {
  const changedItemIdSet = new Set(revision.changedItemIds);
  const displayedSlots = new Set<string>();

  return revision.updatedTodayItems.filter((planItem) => {
    if (!changedItemIdSet.has(planItem.id ?? "")) {
      return false;
    }

    const displayKey = `${planItem.type}:${planItem.slot}`;

    if (displayedSlots.has(displayKey)) {
      return false;
    }

    displayedSlots.add(displayKey);
    return true;
  });
}

export function countChangedTodayItems(planItems: AiPlanItem[]) {
  return planItems.length;
}

export function getChangeBadgeLabel(planItem: AiPlanItem) {
  return planItem.type === "exercise" || planItem.slot === "workout" ? "이동" : "새로 추가";
}
