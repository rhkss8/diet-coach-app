import type { GoalInput, UserProfileInput } from "@diet-coach/core";

export type GoalSetupDraft = {
  targetWeightKg: string;
  targetDate: string;
};

export type GoalSetupFieldErrors = Partial<Record<keyof GoalSetupDraft, string>>;

export const initialGoalSetupDraft: GoalSetupDraft = {
  targetWeightKg: "",
  targetDate: "",
};

export function validateGoalSetupDraft(
  draft: GoalSetupDraft,
  profile: UserProfileInput,
  referenceDate = new Date(),
): GoalSetupFieldErrors {
  const errors: GoalSetupFieldErrors = {};
  const targetWeightKg = Number(draft.targetWeightKg);
  const targetDate = parseISODate(draft.targetDate);

  if (!Number.isFinite(targetWeightKg) || targetWeightKg < 35 || targetWeightKg > 250) {
    errors.targetWeightKg = "목표 체중은 35kg부터 250kg 사이로 입력해주세요.";
  } else if (targetWeightKg >= profile.currentWeightKg) {
    errors.targetWeightKg = "현재 체중보다 낮은 목표를 입력해주세요.";
  }

  if (!targetDate) {
    errors.targetDate = "목표 날짜는 YYYY-MM-DD 형식으로 입력해주세요.";
  } else if (targetDate <= startOfDay(referenceDate)) {
    errors.targetDate = "목표 날짜는 오늘 이후로 입력해주세요.";
  }

  return errors;
}

export function canCompleteGoalSetupStep(draft: GoalSetupDraft, profile: UserProfileInput) {
  return Object.keys(validateGoalSetupDraft(draft, profile)).length === 0;
}

export function createGoalInput(draft: GoalSetupDraft): GoalInput {
  return {
    targetDate: draft.targetDate,
    targetWeightKg: Number(draft.targetWeightKg),
  };
}

function parseISODate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
