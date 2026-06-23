import type { PlanningContext, PlanningGoalType } from "@diet-coach/ai";

export type PlanningContextDraft = {
  allergiesText: string;
  avoidedFoodsText: string;
  eatingContextText: string;
  exerciseWindowsText: string;
  foodsToKeepText: string;
  goalTypes: PlanningGoalType[];
  preferredFoodsText: string;
  reasonText: string;
  riskMomentsText: string;
  routineText: string;
  wakeTimeText: string;
  workEndTimeText: string;
};

export const planningGoalOptions = [
  { label: "체중 감량", value: "weight_loss" },
  { label: "건강 관리", value: "health_management" },
  { label: "식습관 개선", value: "habit_improvement" },
  { label: "운동 루틴", value: "routine_recovery" },
  { label: "무너진 플랜 조정", value: "schedule_recovery" },
  { label: "기타", value: "other" },
] as const satisfies ReadonlyArray<{ label: string; value: PlanningGoalType }>;

export function createEmptyPlanningContextDraft(): PlanningContextDraft {
  return {
    allergiesText: "",
    avoidedFoodsText: "",
    eatingContextText: "",
    exerciseWindowsText: "",
    foodsToKeepText: "",
    goalTypes: [],
    preferredFoodsText: "",
    reasonText: "",
    riskMomentsText: "",
    routineText: "",
    wakeTimeText: "",
    workEndTimeText: "",
  };
}

export function isPlanningContextDraftReady(draft: PlanningContextDraft) {
  return (
    draft.goalTypes.length > 0 &&
    draft.reasonText.trim().length > 0 &&
    hasFoodContext(draft) &&
    draft.routineText.trim().length > 0
  );
}

export function createPlanningContextFromDraft(draft: PlanningContextDraft): PlanningContext {
  return {
    foodContext: {
      allergies: splitListText(draft.allergiesText),
      avoidedFoods: splitListText(draft.avoidedFoodsText),
      eatingContext: splitListText(draft.eatingContextText),
      foodsToKeep: splitListText(draft.foodsToKeepText),
      preferredFoods: splitListText(draft.preferredFoodsText),
    },
    managementIntent: {
      goalTypes: draft.goalTypes,
      reasonText: draft.reasonText.trim(),
    },
    routineContext: {
      exerciseWindows: splitListText(draft.exerciseWindowsText),
      mealWindows: {},
      rawRoutineText: draft.routineText.trim(),
      riskMoments: splitListText(draft.riskMomentsText),
      wakeTime: optionalText(draft.wakeTimeText),
      workEndTime: optionalText(draft.workEndTimeText),
    },
  };
}

export function summarizePlanningContext(context: PlanningContext) {
  const goals = context.managementIntent.goalTypes
    .map((goalType) => planningGoalOptions.find((option) => option.value === goalType)?.label)
    .filter(Boolean)
    .join(", ");
  const foods = [...context.foodContext.preferredFoods, ...context.foodContext.foodsToKeep].join(
    ", ",
  );
  const avoided = [...context.foodContext.avoidedFoods, ...context.foodContext.allergies].join(
    ", ",
  );

  return [
    `관리 목적: ${goals || "직접 입력"}`,
    `어려운 점: ${context.managementIntent.reasonText}`,
    foods ? `먹고 싶은 음식: ${foods}` : undefined,
    avoided ? `피해야 할 음식: ${avoided}` : undefined,
    `하루 루틴: ${context.routineContext.rawRoutineText}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function hasFoodContext(draft: PlanningContextDraft) {
  return [
    draft.preferredFoodsText,
    draft.foodsToKeepText,
    draft.avoidedFoodsText,
    draft.allergiesText,
    draft.eatingContextText,
  ].some((value) => value.trim().length > 0);
}

function optionalText(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function splitListText(value: string) {
  return value
    .split(/[,，、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
