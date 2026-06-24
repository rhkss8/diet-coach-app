import type { GenerateChatPlannerResponseInput } from "../contracts";
import type { AiPrompt } from "./prompt-types";

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
        ].join("\n"),
      },
      {
        role: "user",
        content: JSON.stringify(
          {
            task: "generateChatPlannerResponse",
            input,
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
                        source: "estimated",
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
              "Use plan_revision_suggestion only when currentPlan exists and the user wants today's plan changed.",
              "For plan revisions, changedItemIds must refer to ids from currentPlan items.",
              "If intent is unclear, return clarification_question.",
              "Every suggested or updated item must be renderable by the mobile app.",
            ],
          },
          null,
          2,
        ),
      },
    ],
    responseFormat: {
      type: "json_object",
    },
  };
}
