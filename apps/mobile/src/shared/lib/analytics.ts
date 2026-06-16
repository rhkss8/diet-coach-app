import type {
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsEventPayloadByName,
} from "@diet-coach/core";

import { createAnalyticsEvent } from "@diet-coach/core";

const trackedAnalyticsEvents: AnalyticsEvent[] = [];
const inMemoryAnalyticsProvider = createInMemoryAnalyticsProvider(trackedAnalyticsEvents);
let analyticsProvider: AnalyticsProvider = inMemoryAnalyticsProvider;

export type AnalyticsProvider = {
  track: (event: AnalyticsEvent) => Promise<void> | void;
};

export type SupabaseAnalyticsClient = {
  from: (tableName: "analytics_events") => {
    insert: (row: unknown) => PromiseLike<{ error: { message: string } | null }>;
  };
};

export function trackAnalyticsEvent<TName extends AnalyticsEventName>(
  name: TName,
  payload: AnalyticsEventPayloadByName[TName],
) {
  const event = createAnalyticsEvent(name, payload);

  void Promise.resolve(analyticsProvider.track(event)).catch(() => undefined);

  return event;
}

export function setAnalyticsProvider(provider: AnalyticsProvider) {
  analyticsProvider = provider;
}

export function resetAnalyticsProvider() {
  analyticsProvider = inMemoryAnalyticsProvider;
}

export function readTrackedAnalyticsEvents() {
  return [...trackedAnalyticsEvents];
}

export function clearTrackedAnalyticsEvents() {
  trackedAnalyticsEvents.length = 0;
}

export function createInMemoryAnalyticsProvider(events: AnalyticsEvent[]): AnalyticsProvider {
  return {
    track: (event) => {
      events.push(event);
    },
  };
}

export function createSupabaseAnalyticsProvider(
  client: SupabaseAnalyticsClient,
): AnalyticsProvider {
  return {
    track: async (event) => {
      const { error } = await client.from("analytics_events").insert(toAnalyticsEventRow(event));

      if (error) {
        throw new Error(`analytics_events insert failed: ${error.message}`);
      }
    },
  };
}

function toAnalyticsEventRow(event: AnalyticsEvent) {
  return {
    name: event.name,
    payload: event.payload,
    user_id: getPayloadUserId(event.payload),
    occurred_at: event.occurredAt ?? new Date().toISOString(),
  };
}

function getPayloadUserId(payload: AnalyticsEvent["payload"]) {
  if (isRecord(payload) && typeof payload.userId === "string") {
    return payload.userId;
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
