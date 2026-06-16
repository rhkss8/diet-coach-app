import { useState } from "react";

import type { GoalInput, UserProfileInput } from "@diet-coach/core";

import { createAnalyticsEvent } from "@diet-coach/core";

import { BasicProfileStep } from "./BasicProfileStep";
import { GoalSetupStep } from "./GoalSetupStep";

export type OnboardingResult = {
  profile: UserProfileInput;
  goal: GoalInput;
};

type OnboardingFlowProps = {
  onComplete: (result: OnboardingResult) => void;
};

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [profile, setProfile] = useState<UserProfileInput | null>(null);

  function completeProfile(profileInput: UserProfileInput) {
    createAnalyticsEvent("PROFILE_STEP_COMPLETED", {});
    setProfile(profileInput);
  }

  function completeGoal(goalInput: GoalInput) {
    createAnalyticsEvent("GOAL_STEP_COMPLETED", {});

    if (!profile) {
      return;
    }

    onComplete({
      profile,
      goal: goalInput,
    });
  }

  if (!profile) {
    return <BasicProfileStep onComplete={completeProfile} />;
  }

  return <GoalSetupStep onComplete={completeGoal} profile={profile} />;
}
