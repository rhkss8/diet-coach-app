import { describe, expect, it } from "vitest";

import { basicSettingsItems } from "./settings-items";

describe("basic settings items", () => {
  it("starts with the release readiness settings sections", () => {
    expect(basicSettingsItems.map((item) => item.id)).toEqual([
      "account",
      "notifications",
      "app_info",
    ]);
  });

  it("keeps labels readable", () => {
    for (const item of basicSettingsItems) {
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.description.length).toBeGreaterThan(0);
    }
  });
});
