import {
  adjustTodayPlanWithOpenAi,
  generateChatPlannerResponseWithOpenAi,
  generateInitialPlanWithOpenAi,
} from "../../../packages/ai/src/openai/index.ts";

import type {
  AdjustTodayPlanInput,
  GenerateChatPlannerResponseInput,
  GenerateInitialPlanInput,
} from "../../../packages/ai/src/contracts/index.ts";

const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Origin": "*",
};

type AiPlanFunctionRequest =
  | {
      input: GenerateInitialPlanInput;
      type: "generate_initial_plan";
    }
  | {
      input: GenerateChatPlannerResponseInput;
      type: "generate_chat_response";
    }
  | {
      input: AdjustTodayPlanInput;
      type: "adjust_today_plan";
    };

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return createJsonResponse(
      {
        errors: ["Method not allowed"],
        errorCode: "ai_request_failed",
        ok: false,
      },
      405,
    );
  }

  const body = (await request.json().catch(() => null)) as AiPlanFunctionRequest | null;

  if (
    !body ||
    (body.type !== "generate_initial_plan" &&
      body.type !== "generate_chat_response" &&
      body.type !== "adjust_today_plan")
  ) {
    return createJsonResponse(
      {
        errors: ["Invalid AI function request"],
        errorCode: "ai_request_failed",
        ok: false,
      },
      400,
    );
  }

  const config = {
    apiKey: Deno.env.get("OPENAI_API_KEY"),
    model: Deno.env.get("OPENAI_MODEL"),
  };

  const result = await invokeAiPlanner(body, config);

  return createJsonResponse(result);
});

function createJsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    status,
  });
}

function invokeAiPlanner(
  body: AiPlanFunctionRequest,
  config: {
    apiKey?: string;
    model?: string;
  },
) {
  if (body.type === "generate_initial_plan") {
    return generateInitialPlanWithOpenAi(body.input, config);
  }

  if (body.type === "generate_chat_response") {
    return generateChatPlannerResponseWithOpenAi(body.input, config);
  }

  return adjustTodayPlanWithOpenAi(body.input, config);
}
