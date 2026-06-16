import { describe, expect, it } from "vitest";

import { getRequiredCoreFlowEventNames } from "@diet-coach/core";
import {
  findMissingMobileCoreFlowEvents,
  mobileTrackedAnalyticsEventNames,
} from "./analytics-coverage";

describe("mobile analytics coverage", () => {
  it("covers every required core flow event", () => {
    expect(findMissingMobileCoreFlowEvents()).toEqual([]);
  });

  it("keeps the required core events visible in the mobile coverage list", () => {
    expect(mobileTrackedAnalyticsEventNames).toEqual(
      expect.arrayContaining(getRequiredCoreFlowEventNames()),
    );
  });
});
