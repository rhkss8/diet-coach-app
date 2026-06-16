import type { AiPrompt } from "../prompts";

export type AiFunctionName = "generateInitialPlan" | "adjustTodayPlan" | "summarizeProgress";

export type AiCallBudget = {
  maxEstimatedPromptTokens: number;
  maxRequestedOutputTokens: number;
};

export type AiCallUsageEstimate = {
  estimatedPromptTokens: number;
  requestedOutputTokens: number;
};

export type AiCallLog = {
  functionName: AiFunctionName;
  model: string;
  source: "ai" | "fallback";
  usage: AiCallUsageEstimate;
  createdAt: string;
  errors: string[];
};

export const aiCallBudgets = {
  generateInitialPlan: {
    maxEstimatedPromptTokens: 2600,
    maxRequestedOutputTokens: 1800,
  },
  adjustTodayPlan: {
    maxEstimatedPromptTokens: 2200,
    maxRequestedOutputTokens: 1200,
  },
  summarizeProgress: {
    maxEstimatedPromptTokens: 1200,
    maxRequestedOutputTokens: 500,
  },
} as const satisfies Record<AiFunctionName, AiCallBudget>;

export function estimateAiPromptUsage(
  prompt: AiPrompt,
  requestedOutputTokens: number,
): AiCallUsageEstimate {
  return {
    estimatedPromptTokens: estimateTokens(
      prompt.messages.map((message) => message.content).join("\n"),
    ),
    requestedOutputTokens,
  };
}

export function getAiCallBudget(functionName: AiFunctionName): AiCallBudget {
  return aiCallBudgets[functionName];
}

export function getAiCallBudgetErrors(functionName: AiFunctionName, usage: AiCallUsageEstimate) {
  const budget = getAiCallBudget(functionName);
  const errors: string[] = [];

  if (usage.estimatedPromptTokens > budget.maxEstimatedPromptTokens) {
    errors.push(
      `${functionName} prompt estimate ${usage.estimatedPromptTokens} exceeds budget ${budget.maxEstimatedPromptTokens}`,
    );
  }

  if (usage.requestedOutputTokens > budget.maxRequestedOutputTokens) {
    errors.push(
      `${functionName} output token request ${usage.requestedOutputTokens} exceeds budget ${budget.maxRequestedOutputTokens}`,
    );
  }

  return errors;
}

export function isAiCallWithinBudget(functionName: AiFunctionName, usage: AiCallUsageEstimate) {
  return getAiCallBudgetErrors(functionName, usage).length === 0;
}

export function createAiCallLog({
  createdAt = new Date().toISOString(),
  errors = [],
  functionName,
  model,
  source,
  usage,
}: {
  createdAt?: string;
  errors?: string[];
  functionName: AiFunctionName;
  model: string;
  source: AiCallLog["source"];
  usage: AiCallUsageEstimate;
}): AiCallLog {
  return {
    functionName,
    model,
    source,
    usage,
    createdAt,
    errors,
  };
}

function estimateTokens(value: string) {
  return Math.ceil(value.length / 4);
}
