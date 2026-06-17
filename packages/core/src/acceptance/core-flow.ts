import type { AnalyticsEventName } from "../analytics/events";

export const coreFlowAcceptanceSteps = [
  {
    id: "fresh_user_opens_app",
    label: "Fresh user opens app",
    requiredEvents: ["CHAT_CONSULTATION_STARTED"],
  },
  {
    id: "user_requests_plan_from_chat",
    label: "User requests a plan from chat consultation",
    requiredEvents: ["CHAT_PLANNER_RESPONSE_GENERATED"],
  },
  {
    id: "user_approves_chat_plan_action",
    label: "User approves a suggested meal or exercise action",
    requiredEvents: ["CHAT_PLANNER_ACTION_APPROVED"],
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
    id: "user_requests_revision_from_chat",
    label: "User asks chat to revise the plan",
    requiredEvents: ["CHAT_PLANNER_RESPONSE_GENERATED"],
  },
  {
    id: "user_approves_chat_revision",
    label: "User approves a chat-generated revision",
    requiredEvents: ["CHAT_PLANNER_ACTION_APPROVED"],
  },
  {
    id: "revision_history_is_stored",
    label: "Plan revision history is stored",
    requiredEvents: ["PLAN_REVISION_APPROVED"],
  },
  {
    id: "today_plan_updates",
    label: "Today plan updates after approval",
    requiredEvents: ["PLAN_ITEM_COMPLETED_AFTER_REVISION"],
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
