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
      title: dayIndex % 2 === 0 ? "가벼운 단백질 아침" : "준비 쉬운 아침",
      description:
        dayIndex % 2 === 0
          ? "계란, 요거트, 과일처럼 부담 없는 조합으로 시작해요."
          : "바나나와 요거트처럼 바로 먹을 수 있는 선택지를 준비해요.",
      status: "pending",
    },
    {
      id: `mock-${date}-lunch`,
      planId: "mock-plan-1",
      date,
      type: "meal",
      slot: "lunch",
      title: "현실적인 일반식 점심",
      description: "평소 식사를 유지하되 단백질 반찬을 먼저 챙기고 과한 추가 메뉴만 줄여요.",
      status: "pending",
    },
    {
      id: `mock-${date}-dinner`,
      planId: "mock-plan-1",
      date,
      type: "meal",
      slot: "dinner",
      title: "조정 가능한 저녁",
      description: "점심이 무거웠다면 더 가볍게, 평소와 같았다면 단백질과 채소 중심으로 먹어요.",
      status: "pending",
    },
    {
      id: `mock-${date}-workout`,
      planId: "mock-plan-1",
      date,
      type: "exercise",
      slot: "workout",
      title: workoutIntensity === "light" ? "15분 걷기" : "25분 전신 루틴",
      description:
        workoutIntensity === "light"
          ? "운동복을 갖추지 않아도 되는 산책으로 흐름을 이어가요."
          : "무리하지 않는 강도로 스쿼트, 푸시 동작, 걷기를 섞어요.",
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
