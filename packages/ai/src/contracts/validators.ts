import type {
  AdjustmentReason,
  PlanItemIntensity,
  PlanItemSlot,
  PlanItemStatus,
  PlanItemType,
} from "@diet-coach/core";

import type {
  AdjustTodayPlanOutput,
  AiValidationResult,
  GenerateInitialPlanOutput,
  SummarizeProgressOutput,
} from "./types";

const planItemTypes = ["meal", "exercise"] satisfies PlanItemType[];
const planItemSlots = ["breakfast", "lunch", "dinner", "snack", "workout"] satisfies PlanItemSlot[];
const planItemIntensities = ["light", "moderate", "challenging"] satisfies PlanItemIntensity[];
const planItemStatuses = ["pending", "completed", "skipped", "adjusted"] satisfies PlanItemStatus[];
const adjustmentReasons = [
  "meal_changed",
  "missed_exercise",
  "schedule_changed",
  "want_replan",
] satisfies AdjustmentReason[];

const bannedCopyFragments = [
  "실패",
  "망했",
  "의지",
  "참아야",
  "초과했습니다",
  "지키지 못했",
  "야,",
];

export function validateGenerateInitialPlanOutput(
  value: unknown,
): AiValidationResult<GenerateInitialPlanOutput> {
  const errors: string[] = [];
  const output = asRecord(value, "output", errors);

  if (output) {
    validateAiPlan(output.plan, "plan", errors);
    requireString(output.rationale, "rationale", errors);
    validateUserFacingCopy(output.userMessage, "userMessage", errors);
    validateStringArray(output.adjustmentNotes, "adjustmentNotes", errors);
  }

  return toValidationResult(value, errors);
}

export function validateAdjustTodayPlanOutput(
  value: unknown,
): AiValidationResult<AdjustTodayPlanOutput> {
  const errors: string[] = [];
  const output = asRecord(value, "output", errors);
  const revision = output ? asRecord(output.revision, "revision", errors) : undefined;

  if (revision) {
    requireString(revision.planId, "revision.planId", errors);
    requireString(revision.affectedDate, "revision.affectedDate", errors);
    requireOneOf(revision.reason, adjustmentReasons, "revision.reason", errors);
    requireString(revision.summary, "revision.summary", errors);
    validateUserFacingCopy(revision.userMessage, "revision.userMessage", errors);
    validateStringArray(revision.changedItemIds, "revision.changedItemIds", errors, {
      minLength: 1,
    });
    validateAiPlanItems(revision.updatedTodayItems, "revision.updatedTodayItems", errors, {
      minLength: 1,
    });

    if (revision.updatedFutureItems !== undefined) {
      validateAiPlanItems(revision.updatedFutureItems, "revision.updatedFutureItems", errors);
    }
  }

  return toValidationResult(value, errors);
}

export function validateSummarizeProgressOutput(
  value: unknown,
): AiValidationResult<SummarizeProgressOutput> {
  const errors: string[] = [];
  const output = asRecord(value, "output", errors);

  if (output) {
    validateUserFacingCopy(output.summary, "summary", errors);
    validateUserFacingCopy(output.suggestion, "suggestion", errors);
  }

  return toValidationResult(value, errors);
}

export function validateUserFacingCopy(value: unknown, path: string, errors: string[]) {
  if (!requireString(value, path, errors)) {
    return;
  }

  const copy = value as string;

  for (const bannedCopyFragment of bannedCopyFragments) {
    if (copy.includes(bannedCopyFragment)) {
      errors.push(`${path} contains banned coaching copy: ${bannedCopyFragment}`);
    }
  }
}

function validateAiPlan(value: unknown, path: string, errors: string[]) {
  const plan = asRecord(value, path, errors);

  if (!plan) {
    return;
  }

  validateOptionalString(plan.id, `${path}.id`, errors);
  requireString(plan.goalId, `${path}.goalId`, errors);
  requireString(plan.startDate, `${path}.startDate`, errors);
  requireString(plan.endDate, `${path}.endDate`, errors);
  requireString(plan.summary, `${path}.summary`, errors);
  validateAiPlanItems(plan.items, `${path}.items`, errors, { minLength: 1 });
}

function validateAiPlanItems(
  value: unknown,
  path: string,
  errors: string[],
  options: { minLength?: number } = {},
) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array`);
    return;
  }

  if (options.minLength !== undefined && value.length < options.minLength) {
    errors.push(`${path} must include at least ${options.minLength} item(s)`);
  }

  value.forEach((planItem, index) => {
    validateAiPlanItem(planItem, `${path}.${index}`, errors);
  });
}

function validateAiPlanItem(value: unknown, path: string, errors: string[]) {
  const planItem = asRecord(value, path, errors);

  if (!planItem) {
    return;
  }

  validateOptionalString(planItem.id, `${path}.id`, errors);
  validateOptionalString(planItem.planId, `${path}.planId`, errors);
  requireString(planItem.date, `${path}.date`, errors);
  requireOneOf(planItem.type, planItemTypes, `${path}.type`, errors);
  requireOneOf(planItem.slot, planItemSlots, `${path}.slot`, errors);
  requireString(planItem.title, `${path}.title`, errors);
  requireString(planItem.description, `${path}.description`, errors);
  validateOptionalFoods(planItem.foods, `${path}.foods`, errors);
  validateOptionalNutrition(planItem.nutrition, `${path}.nutrition`, errors);

  if (planItem.intensity !== undefined) {
    requireOneOf(planItem.intensity, planItemIntensities, `${path}.intensity`, errors);
  }

  if (planItem.status !== undefined) {
    requireOneOf(planItem.status, planItemStatuses, `${path}.status`, errors);
  }
}

function validateOptionalFoods(value: unknown, path: string, errors: string[]) {
  if (value === undefined) {
    return;
  }

  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array when present`);
    return;
  }

  value.forEach((food, index) => {
    const foodRecord = asRecord(food, `${path}.${index}`, errors);

    if (!foodRecord) {
      return;
    }

    requireString(foodRecord.name, `${path}.${index}.name`, errors);
    requireString(foodRecord.amount, `${path}.${index}.amount`, errors);
    validateOptionalNumber(foodRecord.caloriesKcal, `${path}.${index}.caloriesKcal`, errors, {
      max: 2000,
      min: 0,
    });
    validateOptionalNumber(foodRecord.proteinG, `${path}.${index}.proteinG`, errors, {
      max: 200,
      min: 0,
    });
    validateOptionalNumber(foodRecord.carbsG, `${path}.${index}.carbsG`, errors, {
      max: 300,
      min: 0,
    });
    validateOptionalNumber(foodRecord.fatG, `${path}.${index}.fatG`, errors, {
      max: 200,
      min: 0,
    });
  });
}

function validateOptionalNutrition(value: unknown, path: string, errors: string[]) {
  if (value === undefined) {
    return;
  }

  const nutrition = asRecord(value, path, errors);

  if (!nutrition) {
    return;
  }

  requireNumber(nutrition.caloriesKcal, `${path}.caloriesKcal`, errors, { max: 3000, min: 0 });
  requireNumber(nutrition.proteinG, `${path}.proteinG`, errors, { max: 300, min: 0 });
  requireNumber(nutrition.carbsG, `${path}.carbsG`, errors, { max: 500, min: 0 });
  requireNumber(nutrition.fatG, `${path}.fatG`, errors, { max: 250, min: 0 });
  validateOptionalString(nutrition.source, `${path}.source`, errors);
  validateOptionalString(nutrition.confidence, `${path}.confidence`, errors);
}

function asRecord(value: unknown, path: string, errors: string[]) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return undefined;
  }

  return value;
}

function requireString(value: unknown, path: string, errors: string[]) {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${path} must be a non-empty string`);
    return false;
  }

  return true;
}

function validateOptionalString(value: unknown, path: string, errors: string[]) {
  if (value !== undefined && typeof value !== "string") {
    errors.push(`${path} must be a string when present`);
  }
}

function requireNumber(
  value: unknown,
  path: string,
  errors: string[],
  range?: { max: number; min: number },
) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    errors.push(`${path} must be a finite number`);
    return false;
  }

  if (range && (value < range.min || value > range.max)) {
    errors.push(`${path} must be between ${range.min} and ${range.max}`);
    return false;
  }

  return true;
}

function validateOptionalNumber(
  value: unknown,
  path: string,
  errors: string[],
  range?: { max: number; min: number },
) {
  if (value === undefined) {
    return;
  }

  requireNumber(value, path, errors, range);
}

function validateStringArray(
  value: unknown,
  path: string,
  errors: string[],
  options: { minLength?: number } = {},
) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array`);
    return;
  }

  if (options.minLength !== undefined && value.length < options.minLength) {
    errors.push(`${path} must include at least ${options.minLength} item(s)`);
  }

  value.forEach((item, index) => {
    requireString(item, `${path}.${index}`, errors);
  });
}

function requireOneOf<T extends string>(
  value: unknown,
  values: readonly T[],
  path: string,
  errors: string[],
) {
  if (typeof value !== "string" || !values.includes(value as T)) {
    errors.push(`${path} must be one of: ${values.join(", ")}`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toValidationResult<T>(value: unknown, errors: string[]): AiValidationResult<T> {
  if (errors.length > 0) {
    return {
      ok: false,
      errors,
    };
  }

  return {
    ok: true,
    data: value as T,
  };
}
