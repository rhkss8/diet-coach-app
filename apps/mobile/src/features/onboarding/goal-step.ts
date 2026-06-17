import type { GoalInput, UserProfileInput } from "@diet-coach/core";

export type GoalSetupDraft = {
  targetWeightKg: string;
  targetDate?: string;
};

export type GoalSetupFieldErrors = Partial<Record<keyof GoalSetupDraft, string>>;

export const initialGoalSetupDraft: GoalSetupDraft = {
  targetWeightKg: "",
};

const targetWeightKgRange = { max: 250, min: 35 };
const targetDateOffsetDays = { max: 730, min: 1 };

export function validateGoalSetupDraft(
  draft: GoalSetupDraft,
  profile: UserProfileInput,
  referenceDate = new Date(),
): GoalSetupFieldErrors {
  const errors: GoalSetupFieldErrors = {};
  const targetWeightKg = parseDecimalDraft(draft.targetWeightKg);
  const targetDate = draft.targetDate ? parseISODate(draft.targetDate) : null;
  const targetDateRange = getTargetDateRange(referenceDate);

  if (targetWeightKg === null) {
    errors.targetWeightKg = "목표 체중은 숫자만 입력해주세요.";
  } else if (targetWeightKg < targetWeightKgRange.min || targetWeightKg > targetWeightKgRange.max) {
    errors.targetWeightKg = `목표 체중은 ${targetWeightKgRange.min}kg부터 ${targetWeightKgRange.max}kg 사이로 입력해주세요.`;
  } else if (targetWeightKg >= profile.currentWeightKg) {
    errors.targetWeightKg = "현재 체중보다 낮은 목표를 입력해주세요.";
  }

  if (draft.targetDate && !targetDate) {
    errors.targetDate = "목표 날짜 형식이 올바르지 않습니다.";
  } else if (
    targetDate &&
    (targetDate < targetDateRange.minDate || targetDate > targetDateRange.maxDate)
  ) {
    errors.targetDate = `목표 날짜는 내일부터 ${targetDateOffsetDays.max}일 이내로 선택해주세요.`;
  }

  return errors;
}

export function canCompleteGoalSetupStep(draft: GoalSetupDraft, profile: UserProfileInput) {
  return Object.keys(validateGoalSetupDraft(draft, profile)).length === 0;
}

export function createGoalInput(draft: GoalSetupDraft): GoalInput {
  return {
    ...(draft.targetDate ? { targetDate: draft.targetDate } : {}),
    targetWeightKg: Number(draft.targetWeightKg),
  };
}

export function getTargetDateRange(referenceDate = new Date()) {
  const today = startOfDay(referenceDate);

  return {
    maxDate: addDays(today, targetDateOffsetDays.max),
    minDate: addDays(today, targetDateOffsetDays.min),
  };
}

export function normalizeGoalWeightInput(value: string) {
  const normalized = value.replace(/[^\d.]/g, "");
  const [whole = "", ...decimalParts] = normalized.split(".");

  if (decimalParts.length === 0) {
    return whole;
  }

  return `${whole}.${decimalParts.join("").slice(0, 1)}`;
}

function parseISODate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function parseDecimalDraft(value: string) {
  if (!/^\d+(\.\d)?$/.test(value)) {
    return null;
  }

  return Number(value);
}
