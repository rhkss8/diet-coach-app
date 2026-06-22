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
      title: dayIndex % 2 === 0 ? "호두 계란 단백질 쉐이크" : "요거트 바나나 단백질볼",
      description: dayIndex % 2 === 0 ? "오전 8시 · 앱 기준 추정치" : "오전 8시 · 앱 기준 추정치",
      foods:
        dayIndex % 2 === 0
          ? [
              { name: "호두", amount: "2알", caloriesKcal: 52, proteinG: 1, carbsG: 1, fatG: 5 },
              {
                name: "삶은 계란",
                amount: "2개",
                caloriesKcal: 156,
                proteinG: 12,
                carbsG: 1,
                fatG: 10,
              },
              {
                name: "단백질 음료",
                amount: "1병",
                caloriesKcal: 165,
                proteinG: 21,
                carbsG: 10,
                fatG: 6,
              },
            ]
          : [
              {
                name: "그릭요거트",
                amount: "150g",
                caloriesKcal: 135,
                proteinG: 15,
                carbsG: 7,
                fatG: 5,
              },
              {
                name: "바나나",
                amount: "1개",
                caloriesKcal: 105,
                proteinG: 1,
                carbsG: 27,
                fatG: 0,
              },
              {
                name: "아몬드",
                amount: "8알",
                caloriesKcal: 56,
                proteinG: 2,
                carbsG: 2,
                fatG: 5,
              },
            ],
      nutrition:
        dayIndex % 2 === 0
          ? createEstimatedNutrition(373, 34, 12, 21)
          : createEstimatedNutrition(296, 18, 36, 10),
      status: dayIndex === 0 ? "completed" : "pending",
    },
    {
      id: `mock-${date}-lunch`,
      planId: "mock-plan-1",
      date,
      type: "meal",
      slot: "lunch",
      title: "닭가슴살 샐러드",
      description: "오후 12시 30분 · 단백질 우선 일반식",
      foods: [
        { name: "닭가슴살", amount: "120g", caloriesKcal: 198, proteinG: 37, carbsG: 0, fatG: 4 },
        { name: "현미밥", amount: "120g", caloriesKcal: 180, proteinG: 4, carbsG: 38, fatG: 1 },
        { name: "샐러드 채소", amount: "150g", caloriesKcal: 35, proteinG: 2, carbsG: 7, fatG: 0 },
      ],
      nutrition: createEstimatedNutrition(413, 43, 45, 5),
      status: dayIndex === 0 ? "completed" : "pending",
    },
    {
      id: `mock-${date}-dinner`,
      planId: "mock-plan-1",
      date,
      type: "meal",
      slot: "dinner",
      title: "현미밥 + 두부구이",
      description: "오후 7시 · 부담 낮춘 균형 저녁",
      foods: [
        { name: "현미밥", amount: "150g", caloriesKcal: 225, proteinG: 5, carbsG: 48, fatG: 2 },
        { name: "두부구이", amount: "150g", caloriesKcal: 180, proteinG: 16, carbsG: 5, fatG: 11 },
        { name: "데친 채소", amount: "120g", caloriesKcal: 45, proteinG: 3, carbsG: 8, fatG: 0 },
      ],
      nutrition: createEstimatedNutrition(450, 24, 61, 13),
      status: "pending",
    },
    {
      id: `mock-${date}-night-meal`,
      planId: "mock-plan-1",
      date,
      type: "meal",
      slot: "snack",
      title: "삼각김밥 + 두유",
      description: "야근 대비 · 편의점 선택지",
      foods: [
        { name: "삼각김밥", amount: "1개", caloriesKcal: 210, proteinG: 5, carbsG: 39, fatG: 4 },
        { name: "무가당 두유", amount: "1팩", caloriesKcal: 120, proteinG: 9, carbsG: 8, fatG: 5 },
      ],
      nutrition: createEstimatedNutrition(330, 14, 47, 9),
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

function createEstimatedNutrition(
  caloriesKcal: number,
  proteinG: number,
  carbsG: number,
  fatG: number,
): AiPlanItem["nutrition"] {
  return {
    caloriesKcal,
    proteinG,
    carbsG,
    fatG,
    source: "estimated",
    confidence: "medium",
  };
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
