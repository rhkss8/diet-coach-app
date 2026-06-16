export type LifestylePace = "fast_3_months" | "steady_6_months" | "consistency_first";
export type LifestyleHardestPart = "meal" | "exercise" | "both";
export type LifestyleExerciseExperience = "none" | "some" | "consistent";

export type LifestyleAnswers = {
  pace: LifestylePace;
  hardestPart: LifestyleHardestPart;
  exerciseExperience: LifestyleExerciseExperience;
};
