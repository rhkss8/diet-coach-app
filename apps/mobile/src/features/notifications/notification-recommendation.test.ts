import { describe, expect, it } from "vitest";

import {
  getNotificationRecommendationEventName,
  shouldShowNotificationRecommendation,
} from "./notification-recommendation";

describe("notification recommendation", () => {
  it("shows the recommendation only before a user decision", () => {
    expect(shouldShowNotificationRecommendation(null)).toBe(true);
    expect(shouldShowNotificationRecommendation("accepted")).toBe(false);
    expect(shouldShowNotificationRecommendation("dismissed")).toBe(false);
  });

  it("maps recommendation decisions to analytics events", () => {
    expect(getNotificationRecommendationEventName("accepted")).toBe("NOTIFICATION_PROMPT_ACCEPTED");
    expect(getNotificationRecommendationEventName("dismissed")).toBe(
      "NOTIFICATION_PROMPT_DISMISSED",
    );
  });
});
