import type {
  AdjustTodayPlanInput,
  AdjustTodayPlanOutput,
  GenerateInitialPlanInput,
  GenerateInitialPlanOutput,
} from "../contracts";
import { parseAdjustTodayPlanResponse, parseGenerateInitialPlanResponse } from "../contracts";
import { generateMockAdjustedPlan, generateMockInitialPlan } from "../mock";

export type AiOutputResolution<TOutput> =
  | {
      output: TOutput;
      source: "ai";
      errors: [];
    }
  | {
      output: TOutput;
      source: "fallback";
      errors: string[];
    };

export function resolveGenerateInitialPlanOutput(
  rawResponse: string,
  input: GenerateInitialPlanInput,
): AiOutputResolution<GenerateInitialPlanOutput> {
  const validation = parseGenerateInitialPlanResponse(rawResponse);

  if (validation.ok) {
    return {
      output: validation.data,
      source: "ai",
      errors: [],
    };
  }

  return {
    output: generateMockInitialPlan(input),
    source: "fallback",
    errors: validation.errors,
  };
}

export function resolveAdjustTodayPlanOutput(
  rawResponse: string,
  input: AdjustTodayPlanInput,
): AiOutputResolution<AdjustTodayPlanOutput> {
  const validation = parseAdjustTodayPlanResponse(rawResponse);

  if (validation.ok) {
    return {
      output: validation.data,
      source: "ai",
      errors: [],
    };
  }

  return {
    output: generateMockAdjustedPlan(input),
    source: "fallback",
    errors: validation.errors,
  };
}
