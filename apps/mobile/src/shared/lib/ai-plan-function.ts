import type {
  AdjustTodayPlanInput,
  AdjustTodayPlanOutput,
  AiGenerationResult,
  ChatPlannerResponse,
  GenerateChatPlannerResponseInput,
} from "@diet-coach/ai";

import { getMobileSupabaseClient } from "./supabase";

type AiPlanFunctionRequest =
  | {
      input: GenerateChatPlannerResponseInput;
      type: "generate_chat_response";
    }
  | {
      input: AdjustTodayPlanInput;
      type: "adjust_today_plan";
    };

export async function generateChatPlannerResponseWithAiFunction(
  input: GenerateChatPlannerResponseInput,
) {
  return invokeAiPlanFunction<ChatPlannerResponse>({
    input,
    type: "generate_chat_response",
  });
}

export async function adjustTodayPlanWithAiFunction(input: AdjustTodayPlanInput) {
  return invokeAiPlanFunction<AdjustTodayPlanOutput>({
    input,
    type: "adjust_today_plan",
  });
}

async function invokeAiPlanFunction<TOutput>(
  body: AiPlanFunctionRequest,
): Promise<AiGenerationResult<TOutput>> {
  const supabaseClient = getMobileSupabaseClient();

  if (!supabaseClient) {
    return {
      errors: ["Supabase client is not configured"],
      errorCode: "ai_not_configured",
      ok: false,
    };
  }

  const { data, error } = await supabaseClient.functions.invoke<AiGenerationResult<TOutput>>(
    "ai-plan",
    {
      body,
    },
  );

  if (error) {
    return {
      errors: [error.message],
      errorCode: "ai_request_failed",
      ok: false,
    };
  }

  return (
    data ?? {
      errors: ["AI function did not return data"],
      errorCode: "ai_response_empty",
      ok: false,
    }
  );
}
