import { useState } from "react";

import type { GoalInput, UserProfileInput } from "@diet-coach/core";

import {
  type GoalSetupDraft,
  createGoalInput,
  initialGoalSetupDraft,
  validateGoalSetupDraft,
} from "./goal-step";

export function useGoalSetupStep(profile: UserProfileInput, onComplete: (goal: GoalInput) => void) {
  const [draft, setDraft] = useState<GoalSetupDraft>(initialGoalSetupDraft);
  const [submitted, setSubmitted] = useState(false);
  const errors = validateGoalSetupDraft(draft, profile);
  const canContinue = Object.keys(errors).length === 0;

  function updateDraft<Field extends keyof GoalSetupDraft>(
    field: Field,
    value: GoalSetupDraft[Field],
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  }

  function completeGoalSetupStep() {
    setSubmitted(true);

    if (!canContinue) {
      return;
    }

    onComplete(createGoalInput(draft));
  }

  return {
    canContinue,
    draft,
    errors: submitted ? errors : {},
    completeGoalSetupStep,
    updateDraft,
  };
}
