import { useState } from "react";

import type { UserProfileInput } from "@diet-coach/core";

import {
  type BasicProfileDraft,
  createUserProfileInput,
  initialBasicProfileDraft,
  validateBasicProfileDraft,
} from "./profile-step";

export function useBasicProfileStep(onComplete: (profile: UserProfileInput) => void) {
  const [draft, setDraft] = useState<BasicProfileDraft>(initialBasicProfileDraft);
  const [submitted, setSubmitted] = useState(false);
  const errors = validateBasicProfileDraft(draft);
  const canContinue = Object.keys(errors).length === 0;

  function updateDraft<Field extends keyof BasicProfileDraft>(
    field: Field,
    value: BasicProfileDraft[Field],
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  }

  function completeProfileStep() {
    setSubmitted(true);

    if (!canContinue) {
      return;
    }

    onComplete(createUserProfileInput(draft));
  }

  return {
    canContinue,
    draft,
    errors: submitted ? errors : {},
    completeProfileStep,
    updateDraft,
  };
}
