import type { GenerateInitialPlanInput, LifestyleAnswers } from "../contracts";

export type InitialFixtureUserId =
  | "breakfast-skipper-office-worker"
  | "normal-lunch-required-worker"
  | "exercise-beginner-night-worker";

export type InitialFixtureUser = {
  id: InitialFixtureUserId;
  label: string;
  persona: string;
  pain: string;
  expectedPlannerBehavior: string;
  input: GenerateInitialPlanInput;
};

const consistencyFirstMealFocused: LifestyleAnswers = {
  pace: "consistency_first",
  hardestPart: "meal",
  exerciseExperience: "some",
};

export const initialFixtureUsers = [
  {
    id: "breakfast-skipper-office-worker",
    label: "Breakfast skipper office worker",
    persona: "30s office worker who often skips breakfast and loses rhythm after lunch.",
    pain: "Past diet apps turned skipped breakfast into guilt instead of helping the day continue.",
    expectedPlannerBehavior:
      "Create a light breakfast option and make lunch/dinner easy to recover without calorie-audit copy.",
    input: {
      profile: {
        age: 34,
        sex: "female",
        heightCm: 164,
        currentWeightKg: 72,
      },
      goal: {
        targetDate: "2026-09-16",
        targetWeightKg: 66,
      },
      lifestyleAnswers: consistencyFirstMealFocused,
      planningContext: {
        managementIntent: {
          goalTypes: ["weight_loss", "schedule_recovery"],
          reasonText: "야근이 많아서 저녁 식단이 자주 무너져요.",
          coachingPreference: "practical",
        },
        foodContext: {
          preferredFoods: ["계란", "두부"],
          foodsToKeep: ["삼각김밥"],
          avoidedFoods: ["크림소스"],
          allergies: ["새우"],
          eatingContext: ["편의점", "회사 식당"],
        },
        routineContext: {
          wakeTime: "08:00",
          mealWindows: {
            breakfast: "08:30",
            lunch: "11:30",
            dinner: "21:30",
          },
          workEndTime: "21:00",
          exerciseWindows: ["퇴근 후 10분"],
          riskMoments: ["야근", "늦은 저녁"],
          rawRoutineText: "8시 기상, 11시 30분 점심, 21시 퇴근이 많아요.",
        },
      },
    },
  },
  {
    id: "normal-lunch-required-worker",
    label: "Normal lunch required worker",
    persona: "Late-20s employee who must eat normal cafeteria lunches with coworkers.",
    pain: "Rigid meal plans fail because lunch cannot be controlled most weekdays.",
    expectedPlannerBehavior:
      "Keep lunch realistic and adjust breakfast, dinner, and workout intensity around a normal lunch.",
    input: {
      profile: {
        age: 29,
        sex: "male",
        heightCm: 176,
        currentWeightKg: 86,
      },
      goal: {
        targetDate: "2026-12-16",
        targetWeightKg: 78,
      },
      lifestyleAnswers: {
        pace: "steady_6_months",
        hardestPart: "meal",
        exerciseExperience: "some",
      },
    },
  },
  {
    id: "exercise-beginner-night-worker",
    label: "Exercise beginner night worker",
    persona: "30s worker with late nights and no stable exercise habit.",
    pain: "Exercise-heavy plans collapse after overtime and do not offer a smaller next step.",
    expectedPlannerBehavior:
      "Start with low-friction movement and protect recovery after missed workouts.",
    input: {
      profile: {
        age: 37,
        sex: "prefer_not_to_say",
        heightCm: 170,
        currentWeightKg: 81,
      },
      goal: {
        targetDate: "2026-10-16",
        targetWeightKg: 75,
      },
      lifestyleAnswers: {
        pace: "consistency_first",
        hardestPart: "exercise",
        exerciseExperience: "none",
      },
    },
  },
] as const satisfies InitialFixtureUser[];

export function getInitialFixtureUser(id: InitialFixtureUserId) {
  return initialFixtureUsers.find((fixtureUser) => fixtureUser.id === id);
}
