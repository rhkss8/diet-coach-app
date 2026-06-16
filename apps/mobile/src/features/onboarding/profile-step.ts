import type { Sex, UserProfileInput } from "@diet-coach/core";

export type BasicProfileDraft = {
  name: string;
  age: string;
  sex: Sex;
  heightCm: string;
  currentWeightKg: string;
};

export type BasicProfileFieldErrors = Partial<Record<keyof BasicProfileDraft, string>>;

export const initialBasicProfileDraft: BasicProfileDraft = {
  name: "",
  age: "",
  sex: "prefer_not_to_say",
  heightCm: "",
  currentWeightKg: "",
};

export function validateBasicProfileDraft(draft: BasicProfileDraft): BasicProfileFieldErrors {
  const errors: BasicProfileFieldErrors = {};
  const age = Number(draft.age);
  const heightCm = Number(draft.heightCm);
  const currentWeightKg = Number(draft.currentWeightKg);

  if (!Number.isInteger(age) || age < 14 || age > 90) {
    errors.age = "나이는 14세부터 90세 사이로 입력해주세요.";
  }

  if (!Number.isFinite(heightCm) || heightCm < 120 || heightCm > 230) {
    errors.heightCm = "키는 120cm부터 230cm 사이로 입력해주세요.";
  }

  if (!Number.isFinite(currentWeightKg) || currentWeightKg < 35 || currentWeightKg > 250) {
    errors.currentWeightKg = "현재 체중은 35kg부터 250kg 사이로 입력해주세요.";
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
    age: Number(draft.age),
    sex: draft.sex,
    heightCm: Number(draft.heightCm),
    currentWeightKg: Number(draft.currentWeightKg),
  };
}
