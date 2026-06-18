import type { AiPlanItem, GenerateInitialPlanInput, GenerateInitialPlanOutput } from "../contracts";

export function generateMockInitialPlan(
  input: GenerateInitialPlanInput,
  startDate: string = toISODate(new Date()),
): GenerateInitialPlanOutput {
  const dates = Array.from({ length: 7 }, (_, index) => addDays(startDate, index));
  const workoutIntensity = getWorkoutIntensity(input.lifestyleAnswers.exerciseExperience);

  return {
    plan: {
      id: "mock-plan-1",
      goalId: "mock-goal-1",
      startDate: dates[0] ?? startDate,
      endDate: dates[6] ?? startDate,
      summary: getPlanSummary(input),
      items: dates.flatMap((date, dayIndex) => createDayItems(date, dayIndex, workoutIntensity)),
    },
    rationale:
      "첫 MVP mock 플랜은 식사 기록보다 계획 지속을 우선합니다. 식사와 운동을 작게 나누고, 조정 가능한 여지를 남깁니다.",
    userMessage: "좋아요. 완벽한 계획보다 이어갈 수 있는 첫 7일 플랜으로 맞춰볼게요.",
    adjustmentNotes: [
      "회식이나 야근이 생기면 남은 식사와 운동을 다시 조정할 수 있어요.",
      "운동을 못 한 날은 다음 날 낮은 강도로 이어가도록 바꿀 수 있어요.",
    ],
  };
}

function createDayItems(
  date: string,
  dayIndex: number,
  workoutIntensity: AiPlanItem["intensity"],
): AiPlanItem[] {
  return [
    {
      id: `mock-${date}-breakfast`,
      planId: "mock-plan-1",
      date,
      type: "meal",
      slot: "breakfast",
      title: dayIndex % 2 === 0 ? "귀리볼 + 삶은 계란" : "요거트 + 바나나",
      description: dayIndex % 2 === 0 ? "오전 8시 · 약 380kcal" : "오전 8시 · 약 360kcal",
      status: dayIndex === 0 ? "completed" : "pending",
    },
    {
      id: `mock-${date}-lunch`,
      planId: "mock-plan-1",
      date,
      type: "meal",
      slot: "lunch",
      title: "닭가슴살 샐러드",
      description: "오후 12시 30분 · 약 420kcal",
      status: dayIndex === 0 ? "completed" : "pending",
    },
    {
      id: `mock-${date}-dinner`,
      planId: "mock-plan-1",
      date,
      type: "meal",
      slot: "dinner",
      title: "현미밥 + 두부구이",
      description: "오후 7시 · 약 510kcal",
      status: "pending",
    },
    {
      id: `mock-${date}-night-meal`,
      planId: "mock-plan-1",
      date,
      type: "meal",
      slot: "snack",
      title: "삼각김밥 + 두유",
      description: "야근 대비 · 약 470kcal",
      status: "pending",
    },
    {
      id: `mock-${date}-workout`,
      planId: "mock-plan-1",
      date,
      type: "exercise",
      slot: "workout",
      title: workoutIntensity === "light" ? "저녁 산책" : "25분 전신 루틴",
      description: workoutIntensity === "light" ? "30분 · 약 120kcal 소모" : "25분 · 가볍게",
      intensity: workoutIntensity,
      status: "pending",
    },
    {
      id: `mock-${date}-stretch`,
      planId: "mock-plan-1",
      date,
      type: "exercise",
      slot: "workout",
      title: "스트레칭 루틴",
      description: "10분 · 취침 전",
      intensity: workoutIntensity,
      status: "pending",
    },
  ];
}

function getWorkoutIntensity(
  exerciseExperience: GenerateInitialPlanInput["lifestyleAnswers"]["exerciseExperience"],
): AiPlanItem["intensity"] {
  if (exerciseExperience === "consistent") {
    return "moderate";
  }

  return "light";
}

function getPlanSummary(input: GenerateInitialPlanInput) {
  if (input.lifestyleAnswers.pace === "fast_3_months") {
    return "3개월 집중 목표지만, MVP mock에서는 무리한 압박보다 조정 가능한 7일 흐름을 우선합니다.";
  }

  if (input.lifestyleAnswers.pace === "steady_6_months") {
    return "6개월 꾸준한 감량을 위해 일반식 점심과 낮은 강도의 운동을 함께 배치합니다.";
  }

  return "지속을 우선하는 7일 플랜입니다. 계획이 달라져도 다시 맞출 수 있게 구성합니다.";
}

function addDays(startDate: string, days: number) {
  const [year, month, day] = startDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));

  return toISODate(date);
}

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}
