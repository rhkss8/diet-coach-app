import { describe, expect, it } from "vitest";

import { getAuthGateState, isValidAuthEmail } from "./auth-session";

describe("auth session helpers", () => {
  it("validates email before requesting a magic link", () => {
    expect(isValidAuthEmail("tester@example.com")).toBe(true);
    expect(isValidAuthEmail("not-an-email")).toBe(false);
  });

  it("prefers authenticated session over guest access", () => {
    expect(getAuthGateState({ hasSession: true, isGuest: true })).toBe("authenticated");
  });

  it("allows guest access for MVP testing", () => {
    expect(getAuthGateState({ hasSession: false, isGuest: true })).toBe("guest");
  });

  it("requires auth when there is no session or guest choice", () => {
    expect(getAuthGateState({ hasSession: false, isGuest: false })).toBe("requires_auth");
  });
});
