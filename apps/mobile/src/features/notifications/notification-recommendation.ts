import type { AnalyticsEventName } from "@diet-coach/core";

export type NotificationRecommendationDecision = "accepted" | "dismissed" | null;

export function shouldShowNotificationRecommendation(decision: NotificationRecommendationDecision) {
  return decision === null;
}

export function getNotificationRecommendationEventName(
  decision: Exclude<NotificationRecommendationDecision, null>,
): AnalyticsEventName {
  return decision === "accepted" ? "NOTIFICATION_PROMPT_ACCEPTED" : "NOTIFICATION_PROMPT_DISMISSED";
}
