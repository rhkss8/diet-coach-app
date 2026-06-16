import type { AdjustTodayPlanOutput, AiValidationResult, GenerateInitialPlanOutput } from "./types";
import { validateAdjustTodayPlanOutput, validateGenerateInitialPlanOutput } from "./validators";

export function parseGenerateInitialPlanResponse(
  value: string,
): AiValidationResult<GenerateInitialPlanOutput> {
  return parseAndValidateAiResponse(value, validateGenerateInitialPlanOutput);
}

export function parseAdjustTodayPlanResponse(
  value: string,
): AiValidationResult<AdjustTodayPlanOutput> {
  return parseAndValidateAiResponse(value, validateAdjustTodayPlanOutput);
}

function parseAndValidateAiResponse<T>(
  value: string,
  validate: (parsedValue: unknown) => AiValidationResult<T>,
): AiValidationResult<T> {
  const parsedValue = parseJsonObject(value);

  if (!parsedValue.ok) {
    return parsedValue;
  }

  return validate(parsedValue.data);
}

function parseJsonObject(value: string): AiValidationResult<unknown> {
  try {
    const parsedValue = JSON.parse(value) as unknown;

    if (!isRecord(parsedValue)) {
      return {
        ok: false,
        errors: ["AI response must be a JSON object"],
      };
    }

    return {
      ok: true,
      data: parsedValue,
    };
  } catch {
    return {
      ok: false,
      errors: ["AI response must be valid JSON"],
    };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
