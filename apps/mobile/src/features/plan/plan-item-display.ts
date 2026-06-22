import type { AiPlanItem } from "@diet-coach/ai";

export function getPlanItemDetail(planItem: AiPlanItem) {
  return planItem.description;
}

export function getPlanItemFoodLines(planItem: AiPlanItem) {
  return planItem.foods?.map((food) => `${food.name} ${food.amount}`) ?? [];
}

export function getPlanItemNutritionSummary(planItem: AiPlanItem) {
  if (!planItem.nutrition) {
    return undefined;
  }

  const { caloriesKcal, proteinG, carbsG, fatG } = planItem.nutrition;

  return `${caloriesKcal}kcal · 단백질 ${proteinG}g · 탄수화물 ${carbsG}g · 지방 ${fatG}g`;
}

export function createEstimatedNutrition(
  caloriesKcal: number,
  proteinG: number,
  carbsG: number,
  fatG: number,
): AiPlanItem["nutrition"] {
  return {
    caloriesKcal,
    proteinG,
    carbsG,
    fatG,
    source: "estimated",
    confidence: "medium",
  };
}
