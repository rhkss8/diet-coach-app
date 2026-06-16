import { useState } from "react";

import type { LifestyleAnswers } from "@diet-coach/core";

import { canCompleteLifestyleStep, initialLifestyleAnswers } from "./lifestyle-step";

export function useLifestyleStep(onComplete: (answers: LifestyleAnswers) => void) {
  const [answers, setAnswers] = useState<LifestyleAnswers>(initialLifestyleAnswers);
  const canContinue = canCompleteLifestyleStep(answers);

  function updateAnswer<Field extends keyof LifestyleAnswers>(
    field: Field,
    value: LifestyleAnswers[Field],
  ) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [field]: value,
    }));
  }

  function completeLifestyleStep() {
    if (!canContinue) {
      return;
    }

    onComplete(answers);
  }

  return {
    answers,
    canContinue,
    completeLifestyleStep,
    updateAnswer,
  };
}
