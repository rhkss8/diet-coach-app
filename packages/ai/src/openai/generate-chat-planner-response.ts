import type { ChatPlannerResponse, GenerateChatPlannerResponseInput } from "../contracts";
import { parseChatPlannerResponse } from "../contracts";
import { buildGenerateChatPlannerResponsePrompt } from "../prompts";
import { requestOpenAiJson } from "./openai-json";
import type { AiGenerationResult, OpenAiRuntimeConfig } from "./types";
import { validationToGenerationResult } from "./types";

export async function generateChatPlannerResponseWithOpenAi(
  input: GenerateChatPlannerResponseInput,
  config: OpenAiRuntimeConfig,
): Promise<AiGenerationResult<ChatPlannerResponse>> {
  const response = await requestOpenAiJson(buildGenerateChatPlannerResponsePrompt(input), config);

  if (!response.ok) {
    return response;
  }

  return validationToGenerationResult(parseChatPlannerResponse(response.output));
}
