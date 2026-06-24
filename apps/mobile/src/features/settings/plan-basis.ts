import type { GoalInput, Sex, UserProfileInput } from "@diet-coach/core";

export type PlanBasis = {
  goal: GoalInput;
  profile: UserProfileInput;
};

export type PlanBasisDraft = {
  age: string;
  currentWeightKg: string;
  heightCm: string;
  name: string;
  sex: Sex;
  targetDate: string;
  targetWeightKg: string;
};

export type PlanBasisFieldErrors = Partial<Record<keyof PlanBasisDraft, string>>;

export const initialPlanBasisDraft: PlanBasisDraft = {
  age: "",
  currentWeightKg: "",
  heightCm: "",
  name: "",
  sex: "prefer_not_to_say",
  targetDate: "",
  targetWeightKg: "",
};

const ageRange = { max: 90, min: 14 };
const heightCmRange = { max: 230, min: 120 };
const weightKgRange = { max: 250, min: 35 };

export function createPlanBasisDraft(planBasis: PlanBasis | null): PlanBasisDraft {
  if (!planBasis) {
    return initialPlanBasisDraft;
  }

  return {
    age: String(planBasis.profile.age ?? ""),
    currentWeightKg: String(planBasis.profile.currentWeightKg),
    heightCm: String(planBasis.profile.heightCm),
    name: planBasis.profile.name ?? "",
    sex: planBasis.profile.sex,
    targetDate: planBasis.goal.targetDate ?? "",
    targetWeightKg: String(planBasis.goal.targetWeightKg),
  };
}

export function validatePlanBasisDraft(draft: PlanBasisDraft): PlanBasisFieldErrors {
  const errors: PlanBasisFieldErrors = {};
  const age = parseIntegerDraft(draft.age);
  const heightCm = parseIntegerDraft(draft.heightCm);
  const currentWeightKg = parseDecimalDraft(draft.currentWeightKg);
  const targetWeightKg = parseDecimalDraft(draft.targetWeightKg);

  if (age === null) {
    errors.age = "나이는 숫자만 입력해주세요.";
  } else if (age < ageRange.min || age > ageRange.max) {
    errors.age = `나이는 ${ageRange.min}세부터 ${ageRange.max}세 사이로 입력해주세요.`;
  }

  if (heightCm === null) {
    errors.heightCm = "키는 숫자만 입력해주세요.";
  } else if (heightCm < heightCmRange.min || heightCm > heightCmRange.max) {
    errors.heightCm = `키는 ${heightCmRange.min}cm부터 ${heightCmRange.max}cm 사이로 입력해주세요.`;
  }

  if (currentWeightKg === null) {
    errors.currentWeightKg = "현재 체중은 숫자만 입력해주세요.";
  } else if (currentWeightKg < weightKgRange.min || currentWeightKg > weightKgRange.max) {
    errors.currentWeightKg = `현재 체중은 ${weightKgRange.min}kg부터 ${weightKgRange.max}kg 사이로 입력해주세요.`;
  }

  if (targetWeightKg === null) {
    errors.targetWeightKg = "목표 체중은 숫자만 입력해주세요.";
  } else if (targetWeightKg < weightKgRange.min || targetWeightKg > weightKgRange.max) {
    errors.targetWeightKg = `목표 체중은 ${weightKgRange.min}kg부터 ${weightKgRange.max}kg 사이로 입력해주세요.`;
  }

  if (draft.targetDate.trim() && !isISODate(draft.targetDate.trim())) {
    errors.targetDate = "목표 날짜는 YYYY-MM-DD 형식으로 입력해주세요.";
  }

  return errors;
}

export function canSavePlanBasisDraft(draft: PlanBasisDraft) {
  return Object.keys(validatePlanBasisDraft(draft)).length === 0;
}

export function createPlanBasis(draft: PlanBasisDraft): PlanBasis {
  const name = draft.name.trim();
  const targetDate = draft.targetDate.trim();

  return {
    goal: {
      ...(targetDate ? { targetDate } : {}),
      targetWeightKg: Number(draft.targetWeightKg),
    },
    profile: {
      ...(name ? { name } : {}),
      age: Number.parseInt(draft.age, 10),
      currentWeightKg: Number(draft.currentWeightKg),
      heightCm: Number.parseInt(draft.heightCm, 10),
      sex: draft.sex,
    },
  };
}

export function normalizeIntegerPlanBasisInput(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizeDecimalPlanBasisInput(value: string) {
  const normalized = value.replace(/[^\d.]/g, "");
  const [whole = "", ...decimalParts] = normalized.split(".");

  if (decimalParts.length === 0) {
    return whole;
  }

  return `${whole}.${decimalParts.join("").slice(0, 1)}`;
}

function parseIntegerDraft(value: string) {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  return Number.parseInt(value, 10);
}

function parseDecimalDraft(value: string) {
  if (!/^\d+(\.\d)?$/.test(value)) {
    return null;
  }

  return Number(value);
}

function isISODate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [yearValue, monthValue, dayValue] = value.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}
