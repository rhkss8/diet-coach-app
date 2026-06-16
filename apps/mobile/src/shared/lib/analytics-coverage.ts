import type { AnalyticsEventName } from "@diet-coach/core";

import { findMissingCoreFlowEventNames } from "@diet-coach/core";

export const mobileTrackedAnalyticsEventNames = [
  "ONBOARDING_STARTED",
  "PROFILE_STEP_COMPLETED",
  "GOAL_STEP_COMPLETED",
  "LIFESTYLE_STEP_COMPLETED",
  "ONBOARDING_COMPLETED",
  "INITIAL_PLAN_GENERATION_STARTED",
  "INITIAL_PLAN_GENERATION_SUCCEEDED",
  "PLAN_APPROVED",
  "TODAY_SCREEN_VIEWED",
  "PLAN_ITEM_COMPLETED",
  "PLAN_ITEM_SKIPPED",
  "ADJUST_TODAY_CLICKED",
  "ADJUSTMENT_REASON_SELECTED",
  "ADJUSTMENT_NOTE_SUBMITTED",
  "PLAN_ADJUSTMENT_GENERATION_STARTED",
  "PLAN_ADJUSTMENT_GENERATION_SUCCEEDED",
  "PLAN_REVISION_APPROVED",
  "PLAN_REVISION_DISMISSED",
  "PLAN_ITEM_COMPLETED_AFTER_REVISION",
] as const satisfies AnalyticsEventName[];

export function findMissingMobileCoreFlowEvents() {
  return findMissingCoreFlowEventNames([...mobileTrackedAnalyticsEventNames]);
}
