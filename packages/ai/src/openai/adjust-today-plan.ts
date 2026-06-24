import type { AdjustTodayPlanInput, AdjustTodayPlanOutput } from "../contracts";
import { parseAdjustTodayPlanResponse } from "../contracts";
import { buildAdjustTodayPlanPrompt } from "../prompts";
import { requestOpenAiJson } from "./openai-json";
import type { AiGenerationResult, OpenAiRuntimeConfig } from "./types";
import { validationToGenerationResult } from "./types";

export async function adjustTodayPlanWithOpenAi(
  input: AdjustTodayPlanInput,
  config: OpenAiRuntimeConfig,
): Promise<AiGenerationResult<AdjustTodayPlanOutput>> {
  const response = await requestOpenAiJson(buildAdjustTodayPlanPrompt(input), config);

  if (!response.ok) {
    return response;
  }

  return validationToGenerationResult(parseAdjustTodayPlanResponse(response.output));
}
