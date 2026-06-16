import { describe, expect, it } from "vitest";

import {
  coreFlowAcceptanceSteps,
  findMissingCoreFlowEventNames,
  getRequiredCoreFlowEventNames,
  isCoreFlowEventCoverageComplete,
} from "./core-flow";

describe("core flow acceptance criteria", () => {
  it("matches the MVP release core flow length", () => {
    expect(coreFlowAcceptanceSteps).toHaveLength(13);
  });

  it("requires the core analytics events needed to prove recovery", () => {
    expect(getRequiredCoreFlowEventNames()).toEqual(
      expect.arrayContaining([
        "ONBOARDING_COMPLETED",
        "INITIAL_PLAN_GENERATION_SUCCEEDED",
        "PLAN_APPROVED",
        "TODAY_SCREEN_VIEWED",
        "PLAN_ITEM_COMPLETED",
        "ADJUST_TODAY_CLICKED",
        "ADJUSTMENT_REASON_SELECTED",
        "PLAN_ADJUSTMENT_GENERATION_SUCCEEDED",
        "PLAN_REVISION_APPROVED",
        "PLAN_ITEM_COMPLETED_AFTER_REVISION",
      ]),
    );
  });

  it("reports missing event coverage", () => {
    expect(findMissingCoreFlowEventNames(["ONBOARDING_STARTED"])).toContain(
      "PLAN_REVISION_APPROVED",
    );
  });

  it("passes coverage only when every required event is observed", () => {
    expect(isCoreFlowEventCoverageComplete(getRequiredCoreFlowEventNames())).toBe(true);
  });
});
