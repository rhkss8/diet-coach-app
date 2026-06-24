import type {
  ChatPlannerAttachment,
  ChatPlannerMessage,
  GenerateChatPlannerResponseInput,
} from "../contracts";
import type { AiPrompt, AiPromptContent } from "./prompt-types";

export function buildGenerateChatPlannerResponsePrompt(
  input: GenerateChatPlannerResponseInput,
): AiPrompt {
  return {
    messages: [
      {
        role: "system",
        content: [
          "You are the consultation engine for a recovery-first diet planner.",
          "Return JSON only. Do not include markdown, comments, or prose outside JSON.",
          "Turn the latest user message into one reviewable plan action or a clarification question.",
          "Use calm Korean user-facing copy. Do not shame the user or call the day a failure.",
          "Do not claim persisted plan data has changed. The app will persist only after approval.",
          "Use food and nutrition as rough app-level estimates, not medical or lab-grade facts.",
          "If planningContext is present, treat it as the primary personalization source for recommendations.",
          "Use captured management intent, food preferences, hard exclusions, allergies, and routine timing.",
        ].join("\n"),
      },
      {
        role: "user",
        content: createChatPlannerPromptContent(input),
      },
    ],
    responseFormat: {
      type: "json_object",
    },
  };
}

function createChatPlannerPromptContent(input: GenerateChatPlannerResponseInput) {
  const textContent = JSON.stringify(
    {
      task: "generateChatPlannerResponse",
      input: sanitizeGenerateChatPlannerResponseInput(input),
      outputContract: {
        oneOf: [
          {
            type: "meal_plan_suggestion",
            message: "Korean assistant message",
            suggestedItems: [
              {
                id: "optional stable string",
                planId: "optional string",
                date: "YYYY-MM-DD",
                type: "meal",
                slot: "breakfast | lunch | dinner | snack",
                title: "short Korean title",
                description: "calm Korean instruction",
                foods: [
                  {
                    name: "food name",
                    amount: "serving amount",
                    caloriesKcal: "estimated number",
                    proteinG: "estimated number",
                    carbsG: "estimated number",
                    fatG: "estimated number",
                  },
                ],
                nutrition: {
                  caloriesKcal: "estimated meal total",
                  proteinG: "estimated meal total",
                  carbsG: "estimated meal total",
                  fatG: "estimated meal total",
                  source: "estimated | attachment_inferred",
                  confidence: "low | medium | high",
                },
                status: "pending",
              },
            ],
            confirmation: {
              action: "add_to_meal_plan",
              label: "식단에 추가하시겠습니까?",
            },
          },
          {
            type: "exercise_plan_suggestion",
            message: "Korean assistant message",
            suggestedItems: [
              {
                id: "optional stable string",
                planId: "optional string",
                date: "YYYY-MM-DD",
                type: "exercise",
                slot: "workout",
                title: "short Korean title",
                description: "calm Korean instruction",
                intensity: "light | moderate | challenging",
                status: "pending",
              },
            ],
            confirmation: {
              action: "add_to_exercise_plan",
              label: "운동에 추가하시겠습니까?",
            },
          },
          {
            type: "plan_revision_suggestion",
            message: "Korean assistant message",
            revision: {
              planId: "string",
              affectedDate: "YYYY-MM-DD",
              reason: "meal_changed | missed_exercise | schedule_changed | want_replan",
              summary: "short Korean summary",
              userMessage: "one calm Korean sentence",
              changedItemIds: ["ids of changed existing plan items"],
              updatedTodayItems: [
                {
                  id: "existing item id",
                  planId: "optional string",
                  date: "YYYY-MM-DD",
                  type: "meal | exercise",
                  slot: "breakfast | lunch | dinner | snack | workout",
                  title: "short Korean title",
                  description: "calm Korean instruction",
                  intensity: "light | moderate | challenging",
                  status: "adjusted",
                },
              ],
            },
            confirmation: {
              action: "revise_plan",
              label: "플랜을 수정하시겠습니까?",
            },
          },
          {
            type: "clarification_question",
            message: "Korean assistant message",
            question: "Korean question",
          },
        ],
      },
      rules: [
        "If the user asks for a meal or food change, prefer meal_plan_suggestion unless they clearly want to revise an existing plan.",
        "If the user asks for exercise, prefer exercise_plan_suggestion.",
        "Use attached images only as rough food evidence. If food or portion is unclear, lower confidence or ask a clarification question.",
        "When deriving food from an attached image, set nutrition.source to attachment_inferred.",
        "Use plan_revision_suggestion only when currentPlan exists and the user wants today's plan changed.",
        "For plan revisions, changedItemIds must refer to ids from currentPlan items.",
        "If planningContext is present, cite at least one captured user trait in message, item description, summary, or userMessage.",
        "Never suggest foods listed in planningContext.foodContext.allergies or planningContext.foodContext.avoidedFoods.",
        "Prefer adapting planningContext.foodContext.foodsToKeep and preferredFoods before removing them.",
        "Place meal and exercise suggestions in slots that fit planningContext.routineContext when possible.",
        "If intent is unclear, return clarification_question.",
        "Every suggested or updated item must be renderable by the mobile app.",
      ],
    },
    null,
    2,
  );
  const imageContent = getLatestImageAnalysisContent(input.messages);

  if (!imageContent.length) {
    return textContent;
  }

  return [{ text: textContent, type: "input_text" }, ...imageContent] satisfies AiPromptContent[];
}

function getLatestImageAnalysisContent(messages: ChatPlannerMessage[]): AiPromptContent[] {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");
  const attachments = latestUserMessage?.attachments ?? [];

  return attachments.flatMap((attachment) => {
    if (!attachment.analysisUrl || !isImageAttachment(attachment)) {
      return [];
    }

    return [
      {
        image_url: attachment.analysisUrl,
        type: "input_image" as const,
      },
    ];
  });
}

function sanitizeGenerateChatPlannerResponseInput(
  input: GenerateChatPlannerResponseInput,
): GenerateChatPlannerResponseInput {
  return {
    ...input,
    messages: input.messages.map((message) => ({
      ...message,
      attachments: message.attachments?.map(sanitizeAttachment),
    })),
  };
}

function sanitizeAttachment(attachment: ChatPlannerAttachment): ChatPlannerAttachment {
  return {
    id: attachment.id,
    mimeType: attachment.mimeType,
    name: attachment.name,
    sizeBytes: attachment.sizeBytes,
    storagePath: attachment.storagePath,
  };
}

function isImageAttachment(attachment: ChatPlannerAttachment) {
  return attachment.mimeType?.startsWith("image/") ?? false;
}
