import type { AiPlanItem, ChatPlannerResponse } from "@diet-coach/ai";

import type { PlanProposalItem } from "../../shared/ui/planner-components";
import { getPlanItemFoodLines, getPlanItemNutritionSummary } from "../plan/plan-item-display";

type ConfirmableChatPlannerResponse = Exclude<
  ChatPlannerResponse,
  { type: "clarification_question" }
>;

/**
 * Converts a structured chat planner response into the two-line proposal rows from Figma Make.
 */
export function getChatProposalPreviewItems(
  response: ConfirmableChatPlannerResponse,
): PlanProposalItem[] {
  if (response.type === "plan_revision_suggestion") {
    return response.revision.updatedTodayItems.slice(0, 2).map(createProposalItem);
  }

  return response.suggestedItems.slice(0, 3).map(createProposalItem);
}

function createProposalItem(item: AiPlanItem): PlanProposalItem {
  return {
    detail: item.description,
    foodLines: getPlanItemFoodLines(item),
    nutritionSummary: getPlanItemNutritionSummary(item),
    title: `${getSlotLabel(item.slot)} · ${item.title}`,
  };
}

function getSlotLabel(slot: string) {
  const labels: Record<string, string> = {
    breakfast: "아침",
    lunch: "점심",
    dinner: "저녁",
    snack: "간식",
    workout: "운동",
  };

  return labels[slot] ?? slot;
}
