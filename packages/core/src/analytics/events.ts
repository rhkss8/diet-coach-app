import type { AdjustmentReason } from "../domain/adjustment";
import type { EntityId, ISODate, ISODateTime } from "../domain/common";
import type { PlanItemType } from "../domain/plan";

export const analyticsEventNames = [
  "ONBOARDING_STARTED",
  "PROFILE_STEP_COMPLETED",
  "GOAL_STEP_COMPLETED",
  "LIFESTYLE_STEP_COMPLETED",
  "ONBOARDING_COMPLETED",
  "CHAT_CONSULTATION_STARTED",
  "CHAT_PLANNER_RESPONSE_GENERATED",
  "CHAT_PLANNER_ACTION_APPROVED",
  "INITIAL_PLAN_GENERATION_STARTED",
  "INITIAL_PLAN_GENERATION_SUCCEEDED",
  "INITIAL_PLAN_GENERATION_FAILED",
  "PLAN_APPROVED",
  "PLAN_REGENERATED",
  "TODAY_SCREEN_VIEWED",
  "PLAN_ITEM_COMPLETED",
  "PLAN_ITEM_SKIPPED",
  "ADJUST_TODAY_CLICKED",
  "ADJUSTMENT_REASON_SELECTED",
  "ADJUSTMENT_NOTE_SUBMITTED",
  "PLAN_ADJUSTMENT_GENERATION_STARTED",
  "PLAN_ADJUSTMENT_GENERATION_SUCCEEDED",
  "PLAN_ADJUSTMENT_GENERATION_FAILED",
  "PLAN_REVISION_APPROVED",
  "PLAN_REVISION_DISMISSED",
  "PLAN_ITEM_COMPLETED_AFTER_REVISION",
  "APP_OPENED_AFTER_REVISION",
  "NEXT_DAY_RETURNED_AFTER_REVISION",
  "NOTIFICATION_PROMPT_SHOWN",
  "NOTIFICATION_PROMPT_ACCEPTED",
  "NOTIFICATION_PROMPT_DISMISSED",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

export const recoveryMetricEventNames = [
  "ADJUST_TODAY_CLICKED",
  "PLAN_REVISION_APPROVED",
  "APP_OPENED_AFTER_REVISION",
  "NEXT_DAY_RETURNED_AFTER_REVISION",
  "PLAN_ITEM_COMPLETED_AFTER_REVISION",
] as const satisfies AnalyticsEventName[];

export type RecoveryMetricEventName = (typeof recoveryMetricEventNames)[number];

export type AnalyticsEventPayloadByName = {
  ONBOARDING_STARTED: OptionalUserPayload;
  PROFILE_STEP_COMPLETED: OptionalUserPayload;
  GOAL_STEP_COMPLETED: OptionalUserPayload;
  LIFESTYLE_STEP_COMPLETED: OptionalUserPayload;
  ONBOARDING_COMPLETED: RequiredUserPayload;
  CHAT_CONSULTATION_STARTED: RequiredUserPayload;
  CHAT_PLANNER_RESPONSE_GENERATED: RequiredUserPayload & {
    responseType: string;
  };
  CHAT_PLANNER_ACTION_APPROVED: RequiredUserPayload & {
    action: string;
    responseType: string;
    planId: EntityId;
  };
  INITIAL_PLAN_GENERATION_STARTED: GoalPayload;
  INITIAL_PLAN_GENERATION_SUCCEEDED: PlanGenerationPayload;
  INITIAL_PLAN_GENERATION_FAILED: GoalPayload & FailurePayload;
  PLAN_APPROVED: PlanPayload;
  PLAN_REGENERATED: PlanPayload;
  TODAY_SCREEN_VIEWED: PlanPayload;
  PLAN_ITEM_COMPLETED: PlanItemPayload;
  PLAN_ITEM_SKIPPED: PlanItemPayload;
  ADJUST_TODAY_CLICKED: AdjustmentPayload;
  ADJUSTMENT_REASON_SELECTED: AdjustmentPayload & {
    reason: AdjustmentReason;
  };
  ADJUSTMENT_NOTE_SUBMITTED: AdjustmentPayload & {
    hasNote: boolean;
  };
  PLAN_ADJUSTMENT_GENERATION_STARTED: AdjustmentPayload & {
    reason: AdjustmentReason;
  };
  PLAN_ADJUSTMENT_GENERATION_SUCCEEDED: RevisionPayload & {
    reason: AdjustmentReason;
  };
  PLAN_ADJUSTMENT_GENERATION_FAILED: AdjustmentPayload &
    FailurePayload & {
      reason: AdjustmentReason;
    };
  PLAN_REVISION_APPROVED: RevisionPayload & {
    reason: AdjustmentReason;
  };
  PLAN_REVISION_DISMISSED: RevisionPayload & {
    reason: AdjustmentReason;
  };
  PLAN_ITEM_COMPLETED_AFTER_REVISION: PlanItemPayload & {
    revisionId: EntityId;
  };
  APP_OPENED_AFTER_REVISION: RevisionPayload;
  NEXT_DAY_RETURNED_AFTER_REVISION: RevisionPayload;
  NOTIFICATION_PROMPT_SHOWN: NotificationPayload;
  NOTIFICATION_PROMPT_ACCEPTED: NotificationPayload;
  NOTIFICATION_PROMPT_DISMISSED: NotificationPayload;
};

export type AnalyticsEvent<TName extends AnalyticsEventName = AnalyticsEventName> = {
  name: TName;
  payload: AnalyticsEventPayloadByName[TName];
  occurredAt?: ISODateTime;
};

export function createAnalyticsEvent<TName extends AnalyticsEventName>(
  name: TName,
  payload: AnalyticsEventPayloadByName[TName],
  occurredAt?: ISODateTime,
): AnalyticsEvent<TName> {
  return {
    name,
    payload,
    occurredAt,
  };
}

export function isAnalyticsEventName(value: string): value is AnalyticsEventName {
  return analyticsEventNames.includes(value as AnalyticsEventName);
}

export function isRecoveryMetricEventName(
  value: AnalyticsEventName,
): value is RecoveryMetricEventName {
  return recoveryMetricEventNames.includes(value as RecoveryMetricEventName);
}

type OptionalUserPayload = {
  userId?: EntityId;
};

type RequiredUserPayload = {
  userId: EntityId;
};

type GoalPayload = RequiredUserPayload & {
  goalId: EntityId;
};

type PlanPayload = GoalPayload & {
  planId: EntityId;
};

type PlanGenerationPayload = PlanPayload & {
  itemCount: number;
};

type PlanItemPayload = PlanPayload & {
  planItemId: EntityId;
  type: PlanItemType;
  date: ISODate;
};

type AdjustmentPayload = RequiredUserPayload & {
  planId: EntityId;
  affectedDate: ISODate;
  reason?: AdjustmentReason;
};

type RevisionPayload = AdjustmentPayload & {
  revisionId: EntityId;
};

type FailurePayload = {
  errorCode: string;
};

type NotificationPayload = RequiredUserPayload & {
  surface: "login" | "home" | "settings";
};
