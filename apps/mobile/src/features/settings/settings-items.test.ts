import { describe, expect, it } from "vitest";

import { basicSettingsItems, getBasicSettingsItems, getReleaseLinks } from "./settings-items";

describe("basic settings items", () => {
  it("starts with the release readiness settings sections", () => {
    expect(basicSettingsItems.map((item) => item.id)).toEqual([
      "account",
      "notifications",
      "privacy_policy",
      "app_info",
    ]);
  });

  it("keeps labels readable", () => {
    for (const item of basicSettingsItems) {
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.description.length).toBeGreaterThan(0);
    }
  });

  it("adds a privacy policy URL when release links are configured", () => {
    expect(
      getBasicSettingsItems({
        privacyPolicyUrl: "https://example.com/privacy",
      }).find((item) => item.id === "privacy_policy"),
    ).toEqual(
      expect.objectContaining({
        url: "https://example.com/privacy",
      }),
    );
  });

  it("reads release links from environment values", () => {
    expect(
      getReleaseLinks({
        EXPO_PUBLIC_PRIVACY_POLICY_URL: "https://example.com/privacy",
      }),
    ).toEqual({
      privacyPolicyUrl: "https://example.com/privacy",
    });
  });
});
