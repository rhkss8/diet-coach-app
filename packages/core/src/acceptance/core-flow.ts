import type { AnalyticsEventName } from "../analytics/events";

export const coreFlowAcceptanceSteps = [
  {
    id: "fresh_user_opens_app",
    label: "Fresh user opens app",
    requiredEvents: ["ONBOARDING_STARTED"],
  },
  {
    id: "user_completes_onboarding",
    label: "User completes onboarding",
    requiredEvents: [
      "PROFILE_STEP_COMPLETED",
      "GOAL_STEP_COMPLETED",
      "LIFESTYLE_STEP_COMPLETED",
      "ONBOARDING_COMPLETED",
    ],
  },
  {
    id: "app_generates_initial_plan",
    label: "App generates a 7-day plan",
    requiredEvents: ["INITIAL_PLAN_GENERATION_STARTED", "INITIAL_PLAN_GENERATION_SUCCEEDED"],
  },
  {
    id: "user_approves_plan",
    label: "User approves the generated plan",
    requiredEvents: ["PLAN_APPROVED"],
  },
  {
    id: "user_opens_today",
    label: "User opens Today plan",
    requiredEvents: ["TODAY_SCREEN_VIEWED"],
  },
  {
    id: "user_completes_plan_item",
    label: "User completes one plan item",
    requiredEvents: ["PLAN_ITEM_COMPLETED"],
  },
  {
    id: "user_starts_adjustment",
    label: "User taps Adjust today",
    requiredEvents: ["ADJUST_TODAY_CLICKED"],
  },
  {
    id: "user_selects_adjustment_reason",
    label: "User selects an adjustment reason",
    requiredEvents: ["ADJUSTMENT_REASON_SELECTED"],
  },
  {
    id: "app_generates_revision",
    label: "App generates a revised plan",
    requiredEvents: ["PLAN_ADJUSTMENT_GENERATION_STARTED", "PLAN_ADJUSTMENT_GENERATION_SUCCEEDED"],
  },
  {
    id: "user_approves_revision",
    label: "User approves the revised plan",
    requiredEvents: ["PLAN_REVISION_APPROVED"],
  },
  {
    id: "today_plan_updates",
    label: "Today plan updates after approval",
    requiredEvents: ["PLAN_ITEM_COMPLETED_AFTER_REVISION"],
  },
  {
    id: "revision_history_is_stored",
    label: "Plan revision history is stored",
    requiredEvents: ["PLAN_REVISION_APPROVED"],
  },
  {
    id: "analytics_events_are_emitted",
    label: "Analytics events are emitted for the full loop",
    requiredEvents: [],
  },
] as const satisfies CoreFlowAcceptanceStep[];

export type CoreFlowAcceptanceStepId = (typeof coreFlowAcceptanceSteps)[number]["id"];

export type CoreFlowAcceptanceStep = {
  id: string;
  label: string;
  requiredEvents: AnalyticsEventName[];
};

export function getRequiredCoreFlowEventNames() {
  return unique(coreFlowAcceptanceSteps.flatMap((acceptanceStep) => acceptanceStep.requiredEvents));
}

export function findMissingCoreFlowEventNames(observedEventNames: AnalyticsEventName[]) {
  const observedEventNameSet = new Set(observedEventNames);

  return getRequiredCoreFlowEventNames().filter(
    (requiredEventName) => !observedEventNameSet.has(requiredEventName),
  );
}

export function isCoreFlowEventCoverageComplete(observedEventNames: AnalyticsEventName[]) {
  return findMissingCoreFlowEventNames(observedEventNames).length === 0;
}

function unique<TValue>(values: TValue[]) {
  return [...new Set(values)];
}
