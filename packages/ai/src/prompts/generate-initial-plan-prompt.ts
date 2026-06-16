import type { GenerateInitialPlanInput } from "../contracts";
import type { AiPrompt } from "./prompt-types";

export function buildGenerateInitialPlanPrompt(input: GenerateInitialPlanInput): AiPrompt {
  return {
    messages: [
      {
        role: "system",
        content: [
          "You are the planning engine for a recovery-first diet planner.",
          "Return JSON only. Do not include markdown, comments, or prose outside JSON.",
          "Create a reviewable 7-day meal and exercise plan that the user can approve before it is saved.",
          "The product is not a medical diagnosis tool and not a precise calorie tracker.",
          "Use calm Korean user-facing copy. Do not shame the user or describe changed days as failure.",
          "Make the plan realistic for the user's lifestyle answers and easy to adjust later.",
        ].join("\n"),
      },
      {
        role: "user",
        content: JSON.stringify(
          {
            task: "generateInitialPlan",
            input,
            outputContract: {
              plan: {
                id: "optional string",
                goalId: "string",
                startDate: "YYYY-MM-DD",
                endDate: "YYYY-MM-DD",
                summary: "short Korean summary",
                items: [
                  {
                    id: "stable string",
                    planId: "optional string",
                    date: "YYYY-MM-DD",
                    type: "meal | exercise",
                    slot: "breakfast | lunch | dinner | snack | workout",
                    title: "short Korean title",
                    description: "calm Korean instruction",
                    intensity: "light | moderate | challenging",
                    status: "pending",
                  },
                ],
              },
              rationale: "short Korean explanation of why this plan fits the user",
              userMessage: "one calm Korean sentence that frames the plan as adjustable",
              adjustmentNotes: [
                "short Korean note explaining how the user can recover if the day changes",
              ],
            },
            rules: [
              "Return at least 7 dates of plan items.",
              "Include meal items and exercise items.",
              "Use the user's goal and lifestyle answers, but avoid medical claims.",
              "Avoid exact calorie precision unless the user provided exact data.",
              "Every item must be renderable by the mobile app.",
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
