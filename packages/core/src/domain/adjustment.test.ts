import { describe, expect, it } from "vitest";

import { getAdjustmentReasonLabel } from "./adjustment";

describe("getAdjustmentReasonLabel", () => {
  it("keeps adjustment reasons expressed in user-facing product language", () => {
    expect(getAdjustmentReasonLabel("meal_changed")).toBe("식사를 다르게 했어요");
    expect(getAdjustmentReasonLabel("want_replan")).toBe("그냥 다시 맞추고 싶어요");
  });
});
