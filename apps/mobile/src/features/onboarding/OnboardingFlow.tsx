import { useEffect, useState } from "react";

import type { GoalInput, LifestyleAnswers, UserProfileInput } from "@diet-coach/core";

import { trackAnalyticsEvent } from "../../shared/lib/analytics";
import { BasicProfileStep } from "./BasicProfileStep";
import { GoalSetupStep } from "./GoalSetupStep";
import { LifestyleStep } from "./LifestyleStep";

export type OnboardingResult = {
  profile: UserProfileInput;
  goal: GoalInput;
  lifestyleAnswers: LifestyleAnswers;
};

type OnboardingFlowProps = {
  onComplete: (result: OnboardingResult) => void;
};

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [profile, setProfile] = useState<UserProfileInput | null>(null);
  const [goal, setGoal] = useState<GoalInput | null>(null);

  useEffect(() => {
    trackAnalyticsEvent("ONBOARDING_STARTED", {});
  }, []);

  function completeProfile(profileInput: UserProfileInput) {
    trackAnalyticsEvent("PROFILE_STEP_COMPLETED", {});
    setProfile(profileInput);
  }

  function completeGoal(goalInput: GoalInput) {
    trackAnalyticsEvent("GOAL_STEP_COMPLETED", {});
    setGoal(goalInput);
  }

  function completeLifestyle(lifestyleAnswers: LifestyleAnswers) {
    trackAnalyticsEvent("LIFESTYLE_STEP_COMPLETED", {});
    trackAnalyticsEvent("ONBOARDING_COMPLETED", { userId: "local-user" });

    if (!profile || !goal) {
      return;
    }

    onComplete({
      profile,
      goal,
      lifestyleAnswers,
    });
  }

  if (!profile) {
    return <BasicProfileStep onComplete={completeProfile} />;
  }

  if (!goal) {
    return <GoalSetupStep onComplete={completeGoal} profile={profile} />;
  }

  return <LifestyleStep onComplete={completeLifestyle} />;
}
