import { describe, expect, it } from "vitest";

import {
  canPopAppRoute,
  initialAppRouteHistory,
  popAppRoute,
  pushAppRoute,
} from "./app-route-history";

describe("app route history", () => {
  it("starts at consultation without an in-app back target", () => {
    expect(initialAppRouteHistory).toEqual(["consultation"]);
    expect(canPopAppRoute(initialAppRouteHistory)).toBe(false);
  });

  it("does not push the current route twice", () => {
    expect(pushAppRoute(["consultation", "today"], "today")).toEqual(["consultation", "today"]);
  });

  it("pops back from today to consultation", () => {
    expect(popAppRoute(["consultation", "today"])).toEqual(["consultation"]);
  });
});
