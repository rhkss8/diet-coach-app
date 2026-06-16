import { useEffect, useState } from "react";

import { trackAnalyticsEvent } from "../../shared/lib/analytics";
import {
  getNotificationRecommendationEventName,
  type NotificationRecommendationDecision,
  shouldShowNotificationRecommendation,
} from "./notification-recommendation";
import {
  loadNotificationRecommendationDecision,
  saveNotificationRecommendationDecision,
} from "./notificationPreferenceStorage";

export function useNotificationRecommendation() {
  const [decision, setDecision] = useState<NotificationRecommendationDecision>(null);
  const [isHydratingNotificationDecision, setIsHydratingNotificationDecision] = useState(true);
  const shouldShowRecommendation = shouldShowNotificationRecommendation(decision);

  useEffect(() => {
    let isMounted = true;

    loadNotificationRecommendationDecision()
      .then((storedDecision) => {
        if (isMounted) {
          setDecision(storedDecision);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsHydratingNotificationDecision(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydratingNotificationDecision && shouldShowRecommendation) {
      trackAnalyticsEvent("NOTIFICATION_PROMPT_SHOWN", {
        userId: "local-user",
        surface: "home",
      });
    }
  }, [isHydratingNotificationDecision, shouldShowRecommendation]);

  async function decideNotificationRecommendation(
    nextDecision: Exclude<NotificationRecommendationDecision, null>,
  ) {
    await saveNotificationRecommendationDecision(nextDecision);
    setDecision(nextDecision);
    trackAnalyticsEvent(getNotificationRecommendationEventName(nextDecision), {
      userId: "local-user",
      surface: "home",
    });
  }

  return {
    decideNotificationRecommendation,
    isHydratingNotificationDecision,
    shouldShowRecommendation,
  };
}
