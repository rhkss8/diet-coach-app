import type {
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsEventPayloadByName,
} from "@diet-coach/core";

import { createAnalyticsEvent } from "@diet-coach/core";

const trackedAnalyticsEvents: AnalyticsEvent[] = [];

export function trackAnalyticsEvent<TName extends AnalyticsEventName>(
  name: TName,
  payload: AnalyticsEventPayloadByName[TName],
) {
  const event = createAnalyticsEvent(name, payload);

  trackedAnalyticsEvents.push(event);

  return event;
}

export function readTrackedAnalyticsEvents() {
  return [...trackedAnalyticsEvents];
}

export function clearTrackedAnalyticsEvents() {
  trackedAnalyticsEvents.length = 0;
}
