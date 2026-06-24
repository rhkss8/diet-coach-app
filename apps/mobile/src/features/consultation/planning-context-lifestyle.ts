import type { LifestyleAnswers } from "@diet-coach/core";
import type { PlanningContext } from "@diet-coach/ai";

export function deriveLifestyleAnswersFromPlanningContext(
  planningContext: PlanningContext,
): LifestyleAnswers {
  const goalTypes = planningContext.managementIntent.goalTypes;
  const preferredMethods = planningContext.managementIntent.preferredMethods ?? [];
  const hasMealGoal = goalTypes.some((goalType) =>
    ["weight_loss", "health_management", "habit_improvement"].includes(goalType),
  );
  const hasExerciseGoal =
    goalTypes.includes("routine_recovery") ||
    preferredMethods.some((method) => /걷기|홈트|헬스|운동|pt/i.test(method));

  return {
    exerciseExperience: hasExerciseGoal ? "some" : "none",
    hardestPart: getHardestPart({ hasExerciseGoal, hasMealGoal }),
    pace: goalTypes.includes("weight_loss") ? "steady_6_months" : "consistency_first",
  };
}

function getHardestPart({
  hasExerciseGoal,
  hasMealGoal,
}: {
  hasExerciseGoal: boolean;
  hasMealGoal: boolean;
}): LifestyleAnswers["hardestPart"] {
  if (hasExerciseGoal && hasMealGoal) {
    return "both";
  }

  if (hasExerciseGoal) {
    return "exercise";
  }

  return "meal";
}
