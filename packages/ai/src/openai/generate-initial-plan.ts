import type { GenerateInitialPlanInput, GenerateInitialPlanOutput } from "../contracts";
import { parseGenerateInitialPlanResponse } from "../contracts";
import { buildGenerateInitialPlanPrompt } from "../prompts";
import { requestOpenAiJson } from "./openai-json";
import type { AiGenerationResult, OpenAiRuntimeConfig } from "./types";
import { validationToGenerationResult } from "./types";

export async function generateInitialPlanWithOpenAi(
  input: GenerateInitialPlanInput,
  config: OpenAiRuntimeConfig,
): Promise<AiGenerationResult<GenerateInitialPlanOutput>> {
  const response = await requestOpenAiJson(buildGenerateInitialPlanPrompt(input), config);

  if (!response.ok) {
    return response;
  }

  return validationToGenerationResult(parseGenerateInitialPlanResponse(response.output));
}
