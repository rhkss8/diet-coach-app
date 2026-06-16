import type { LifestyleAnswers } from "@diet-coach/core";

export const initialLifestyleAnswers: LifestyleAnswers = {
  pace: "consistency_first",
  hardestPart: "meal",
  exerciseExperience: "none",
};

export function canCompleteLifestyleStep(answers: LifestyleAnswers) {
  return Boolean(answers.pace && answers.hardestPart && answers.exerciseExperience);
}
