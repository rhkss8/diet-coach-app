import { describe, expect, it } from "vitest";

import { getInitialFixtureUser, initialFixtureUsers } from "./initial-users";

describe("initial fixture users", () => {
  it("keeps stable unique fixture ids", () => {
    const ids = initialFixtureUsers.map((fixtureUser) => fixtureUser.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers the first onboarding inputs needed by plan generation", () => {
    for (const fixtureUser of initialFixtureUsers) {
      expect(fixtureUser.input.profile.heightCm).toBeGreaterThan(0);
      expect(fixtureUser.input.profile.currentWeightKg).toBeGreaterThan(0);
      expect(fixtureUser.input.goal.targetDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(fixtureUser.input.goal.targetWeightKg).toBeGreaterThan(0);
      expect(fixtureUser.input.lifestyleAnswers.pace).toBeTruthy();
      expect(fixtureUser.input.lifestyleAnswers.hardestPart).toBeTruthy();
      expect(fixtureUser.input.lifestyleAnswers.exerciseExperience).toBeTruthy();
    }
  });

  it("starts with persona coverage for meal rigidity and exercise friction", () => {
    expect(
      initialFixtureUsers.some((fixtureUser) => fixtureUser.id.includes("breakfast-skipper")),
    ).toBe(true);
    expect(initialFixtureUsers.some((fixtureUser) => fixtureUser.id.includes("normal-lunch"))).toBe(
      true,
    );
    expect(
      initialFixtureUsers.some((fixtureUser) => fixtureUser.id.includes("exercise-beginner")),
    ).toBe(true);
  });

  it("finds a fixture by id", () => {
    expect(getInitialFixtureUser("normal-lunch-required-worker")?.input.lifestyleAnswers.pace).toBe(
      "steady_6_months",
    );
  });
});
