import type { AdjustTodayPlanInput } from "../contracts";
import type { AiPrompt } from "./prompt-types";

export function buildAdjustTodayPlanPrompt(input: AdjustTodayPlanInput): AiPrompt {
  return {
    messages: [
      {
        role: "system",
        content: [
          "You are the adjustment engine for a recovery-first diet planner.",
          "Return JSON only. Do not include markdown, comments, or prose outside JSON.",
          "Create a proposed PlanRevision only. Do not claim that persisted plan data has changed.",
          "The user has manually asked for adjustment, so treat this as requested support, not automatic correction.",
          "Use calm Korean user-facing copy. Do not shame the user or call the day a failure.",
          "If food context exists, use it as rough context. Do not present precise calorie judgment.",
          "Adjust only the plan items needed for the user's reason and completed item list.",
        ].join("\n"),
      },
      {
        role: "user",
        content: JSON.stringify(
          {
            task: "adjustTodayPlan",
            input,
            outputContract: {
              revision: {
                planId: "string",
                affectedDate: "YYYY-MM-DD",
                reason: "meal_changed | missed_exercise | schedule_changed | want_replan",
                summary: "short Korean summary of what changed",
                userMessage: "one calm Korean sentence that helps the user continue",
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
                updatedFutureItems: [
                  {
                    id: "existing future item id when applicable",
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
            },
            rules: [
              "Return revision.updatedTodayItems with at least one renderable item.",
              "Keep completed items unchanged unless the user explicitly asks to replan them.",
              "Use updatedFutureItems only when the reason needs tomorrow or later changes.",
              "Every changedItemIds entry must refer to an item id from currentPlan or todayItems.",
              "Do not include medical diagnosis, shame copy, or exact calorie claims.",
              "The app will persist the revision only after the user approves it.",
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
