import type { AiValidationResult } from "../contracts";

export type AiGenerationResult<TOutput> =
  | {
      ok: true;
      output: TOutput;
    }
  | {
      ok: false;
      errorCode:
        | "ai_not_configured"
        | "ai_request_failed"
        | "ai_response_empty"
        | "ai_response_invalid";
      errors: string[];
    };

export type OpenAiRuntimeConfig = {
  apiKey?: string;
  model?: string;
};

export function validationToGenerationResult<TOutput>(
  validation: AiValidationResult<TOutput>,
): AiGenerationResult<TOutput> {
  if (validation.ok) {
    return {
      ok: true,
      output: validation.data,
    };
  }

  return {
    ok: false,
    errorCode: "ai_response_invalid",
    errors: validation.errors,
  };
}
