import type { AiPlanFood, AiPlanItem } from "@diet-coach/ai";

export function getPlanItemDetail(planItem: AiPlanItem) {
  return planItem.description;
}

export function getPlanItemFoodLines(planItem: AiPlanItem) {
  return getDisplayFoods(planItem).map((food) => `${food.name} ${food.amount}`);
}

export function getPlanItemNutritionSummary(planItem: AiPlanItem) {
  const nutrition = getDisplayNutrition(planItem);

  if (!nutrition) {
    return undefined;
  }

  const { caloriesKcal, proteinG, carbsG, fatG } = nutrition;

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

function getDisplayFoods(planItem: AiPlanItem) {
  if (planItem.foods?.length) {
    return planItem.foods;
  }

  return getLegacyMealFallback(planItem)?.foods ?? [];
}

function getDisplayNutrition(planItem: AiPlanItem) {
  return planItem.nutrition ?? getLegacyMealFallback(planItem)?.nutrition;
}

function getLegacyMealFallback(planItem: AiPlanItem) {
  if (planItem.type !== "meal") {
    return undefined;
  }

  return legacyMealFallbacks[planItem.slot];
}

const legacyMealFallbacks: Partial<
  Record<
    AiPlanItem["slot"],
    {
      foods: AiPlanFood[];
      nutrition: AiPlanItem["nutrition"];
    }
  >
> = {
  breakfast: {
    foods: [
      { name: "호두", amount: "2알", caloriesKcal: 52, proteinG: 1, carbsG: 1, fatG: 5 },
      { name: "삶은 계란", amount: "2개", caloriesKcal: 156, proteinG: 12, carbsG: 1, fatG: 10 },
      { name: "단백질 음료", amount: "1병", caloriesKcal: 165, proteinG: 21, carbsG: 10, fatG: 6 },
    ],
    nutrition: createEstimatedNutrition(373, 34, 12, 21),
  },
  lunch: {
    foods: [
      { name: "닭가슴살", amount: "120g", caloriesKcal: 198, proteinG: 37, carbsG: 0, fatG: 4 },
      { name: "현미밥", amount: "120g", caloriesKcal: 180, proteinG: 4, carbsG: 38, fatG: 1 },
      { name: "샐러드 채소", amount: "150g", caloriesKcal: 35, proteinG: 2, carbsG: 7, fatG: 0 },
    ],
    nutrition: createEstimatedNutrition(413, 43, 45, 5),
  },
  dinner: {
    foods: [
      { name: "현미밥", amount: "150g", caloriesKcal: 225, proteinG: 5, carbsG: 48, fatG: 2 },
      { name: "두부구이", amount: "150g", caloriesKcal: 180, proteinG: 16, carbsG: 5, fatG: 11 },
      { name: "데친 채소", amount: "120g", caloriesKcal: 45, proteinG: 3, carbsG: 8, fatG: 0 },
    ],
    nutrition: createEstimatedNutrition(450, 24, 61, 13),
  },
  snack: {
    foods: [
      { name: "삼각김밥", amount: "1개", caloriesKcal: 210, proteinG: 5, carbsG: 39, fatG: 4 },
      { name: "무가당 두유", amount: "1팩", caloriesKcal: 120, proteinG: 9, carbsG: 8, fatG: 5 },
    ],
    nutrition: createEstimatedNutrition(330, 14, 47, 9),
  },
};
