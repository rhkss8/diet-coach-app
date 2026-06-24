import type { AiPromptContent } from "../prompts";
import type { AiPrompt } from "../prompts";
import type { AiGenerationResult, OpenAiRuntimeConfig } from "./types";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";

type OpenAiMessage = {
  role: "system" | "user";
  content: AiPromptContent[] | string;
};

type OpenAiResponsesBody = {
  model: string;
  input: OpenAiMessage[];
  text: {
    format: {
      type: "json_object";
    };
  };
};

export async function requestOpenAiJson(
  prompt: AiPrompt,
  config: OpenAiRuntimeConfig,
): Promise<AiGenerationResult<string>> {
  const apiKey = config.apiKey?.trim();

  if (!apiKey) {
    return {
      ok: false,
      errorCode: "ai_not_configured",
      errors: ["OpenAI API key is not configured"],
    };
  }

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      body: JSON.stringify(createResponsesBody(prompt, config.model)),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const responseBody = (await response.json()) as unknown;

    if (!response.ok) {
      return {
        ok: false,
        errorCode: "ai_request_failed",
        errors: [
          getOpenAiErrorMessage(responseBody) ?? `OpenAI request failed: ${response.status}`,
        ],
      };
    }

    const outputText = extractOutputText(responseBody);

    if (!outputText) {
      return {
        ok: false,
        errorCode: "ai_response_empty",
        errors: ["OpenAI response did not include output text"],
      };
    }

    return {
      ok: true,
      output: outputText,
    };
  } catch (error) {
    return {
      ok: false,
      errorCode: "ai_request_failed",
      errors: [error instanceof Error ? error.message : "OpenAI request failed"],
    };
  }
}

function createResponsesBody(prompt: AiPrompt, model = DEFAULT_OPENAI_MODEL): OpenAiResponsesBody {
  return {
    input: prompt.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
    model,
    text: {
      format: {
        type: "json_object",
      },
    },
  };
}

function extractOutputText(value: unknown): string | null {
  const response = asRecord(value);
  const outputText = response ? response.output_text : undefined;

  if (typeof outputText === "string" && outputText.trim()) {
    return outputText;
  }

  const output = response && Array.isArray(response.output) ? response.output : [];

  for (const outputItem of output) {
    const item = asRecord(outputItem);
    const content = item && Array.isArray(item.content) ? item.content : [];

    for (const contentItem of content) {
      const contentRecord = asRecord(contentItem);
      const text = contentRecord?.text;

      if (typeof text === "string" && text.trim()) {
        return text;
      }
    }
  }

  return null;
}

function getOpenAiErrorMessage(value: unknown) {
  const error = asRecord(asRecord(value)?.error);
  const message = error?.message;

  return typeof message === "string" ? message : null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}
