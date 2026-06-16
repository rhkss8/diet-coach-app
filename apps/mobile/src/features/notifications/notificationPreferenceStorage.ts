import AsyncStorage from "@react-native-async-storage/async-storage";

import type { NotificationRecommendationDecision } from "./notification-recommendation";

const notificationRecommendationStorageKey = "diet-coach.notification-recommendation";

export async function saveNotificationRecommendationDecision(
  decision: Exclude<NotificationRecommendationDecision, null>,
) {
  await AsyncStorage.setItem(notificationRecommendationStorageKey, decision);
}

export async function loadNotificationRecommendationDecision(): Promise<NotificationRecommendationDecision> {
  const storedValue = await AsyncStorage.getItem(notificationRecommendationStorageKey);

  return storedValue === "accepted" || storedValue === "dismissed" ? storedValue : null;
}
