import type { Sex, UserProfileInput } from "@diet-coach/core";

export type BasicProfileDraft = {
  name: string;
  age: string;
  sex: Sex;
  heightCm: string;
  currentWeightKg: string;
};

export type BasicProfileFieldErrors = Partial<Record<keyof BasicProfileDraft, string>>;

const ageRange = { max: 90, min: 14 };
const heightCmRange = { max: 230, min: 120 };
const currentWeightKgRange = { max: 250, min: 35 };

export const initialBasicProfileDraft: BasicProfileDraft = {
  name: "",
  age: "",
  sex: "prefer_not_to_say",
  heightCm: "",
  currentWeightKg: "",
};

export function validateBasicProfileDraft(draft: BasicProfileDraft): BasicProfileFieldErrors {
  const errors: BasicProfileFieldErrors = {};
  const age = parseIntegerDraft(draft.age);
  const heightCm = parseIntegerDraft(draft.heightCm);
  const currentWeightKg = parseDecimalDraft(draft.currentWeightKg);

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
  } else if (
    currentWeightKg < currentWeightKgRange.min ||
    currentWeightKg > currentWeightKgRange.max
  ) {
    errors.currentWeightKg = `현재 체중은 ${currentWeightKgRange.min}kg부터 ${currentWeightKgRange.max}kg 사이로 입력해주세요.`;
  }

  return errors;
}

export function canCompleteBasicProfileStep(draft: BasicProfileDraft) {
  return Object.keys(validateBasicProfileDraft(draft)).length === 0;
}

export function createUserProfileInput(draft: BasicProfileDraft): UserProfileInput {
  const name = draft.name.trim();

  return {
    ...(name.length > 0 ? { name } : {}),
    age: Number.parseInt(draft.age, 10),
    sex: draft.sex,
    heightCm: Number.parseInt(draft.heightCm, 10),
    currentWeightKg: Number(draft.currentWeightKg),
  };
}

export function normalizeIntegerInput(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizeDecimalInput(value: string) {
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
