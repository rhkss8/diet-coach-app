import type { AdjustTodayPlanInput, AdjustTodayPlanOutput, AiPlan, AiPlanItem } from "../contracts";

export type AdjustmentFixtureCaseId =
  | "heavy-lunch-adjust-dinner"
  | "missed-workout-adjust-tomorrow"
  | "schedule-changed-late-work"
  | "wants-gentler-plan"
  | "skipped-breakfast-recover-day"
  | "normal-lunch-protect-social-meal";

export type AdjustmentFixtureCase = {
  id: AdjustmentFixtureCaseId;
  label: string;
  scenario: string;
  expectedPlannerBehavior: string;
  input: AdjustTodayPlanInput;
  sampleOutput: AdjustTodayPlanOutput;
};

const currentPlan: AiPlan = {
  id: "plan-fixture-1",
  goalId: "goal-fixture-1",
  startDate: "2026-06-16",
  endDate: "2026-06-22",
  summary: "현실적인 식사와 낮은 진입장벽 운동을 우선하는 7일 플랜",
  items: [
    createMealItem("breakfast", "가벼운 아침", "요거트와 과일로 시작해요."),
    createMealItem("lunch", "일반 점심", "회사 점심을 평소처럼 먹되 국물과 튀김을 줄여요."),
    createMealItem("dinner", "균형 저녁", "단백질과 채소 중심으로 마무리해요."),
    createWorkoutItem("workout", "20분 산책", "퇴근 후 무리 없는 속도로 걸어요."),
  ],
};

const todayItems = currentPlan.items.filter((planItem) => planItem.date === "2026-06-16");

export const adjustmentFixtureCases = [
  {
    id: "heavy-lunch-adjust-dinner",
    label: "Heavy lunch adjusts dinner",
    scenario: "사용자가 점심을 무겁게 먹고 남은 저녁을 다시 맞추고 싶어 한다.",
    expectedPlannerBehavior:
      "정확한 칼로리 추궁 없이 저녁을 가볍게 조정하고 이어갈 메시지를 제공한다.",
    input: {
      currentPlan,
      todayItems,
      completedItemIds: ["item-lunch"],
      request: {
        planId: "plan-fixture-1",
        affectedDate: "2026-06-16",
        reason: "meal_changed",
        note: "점심에 제육볶음이랑 밥을 많이 먹었어.",
      },
      foodContext: {
        text: "제육볶음, 밥, 국",
        interpretedFoodName: "제육볶음 정식",
        interpretedPortion: "평소보다 많은 점심",
      },
    },
    sampleOutput: createAdjustmentOutput({
      reason: "meal_changed",
      summary: "점심이 무거웠으니 저녁을 가볍게 조정합니다.",
      userMessage: "괜찮아요. 남은 하루 기준으로 저녁을 다시 맞춰볼게요.",
      changedItemIds: ["item-dinner"],
      updatedTodayItems: [
        createMealItem(
          "dinner",
          "가벼운 회복 저녁",
          "두부나 닭가슴살, 채소 위주로 부담 없이 마무리해요.",
          {
            status: "adjusted",
          },
        ),
      ],
    }),
  },
  {
    id: "missed-workout-adjust-tomorrow",
    label: "Missed workout adjusts tomorrow",
    scenario: "야근으로 오늘 운동을 못 했고 내일로 무리 없이 넘기고 싶어 한다.",
    expectedPlannerBehavior: "오늘을 탓하지 않고 내일 낮은 강도의 대체 운동을 제안한다.",
    input: {
      currentPlan,
      todayItems,
      completedItemIds: ["item-breakfast", "item-lunch"],
      request: {
        planId: "plan-fixture-1",
        affectedDate: "2026-06-16",
        reason: "missed_exercise",
        note: "야근 때문에 오늘 운동은 못 할 것 같아.",
      },
    },
    sampleOutput: createAdjustmentOutput({
      reason: "missed_exercise",
      summary: "오늘 운동은 쉬고 내일 짧은 걷기로 다시 이어갑니다.",
      userMessage: "오늘은 일정에 맞추고, 내일 부담 없는 움직임으로 이어가면 돼요.",
      changedItemIds: ["item-workout"],
      updatedTodayItems: [
        createWorkoutItem(
          "workout",
          "오늘 운동 쉬기",
          "오늘은 회복을 우선하고 가벼운 스트레칭만 해요.",
          {
            status: "adjusted",
          },
        ),
      ],
      updatedFutureItems: [
        {
          ...createWorkoutItem(
            "workout",
            "내일 15분 걷기",
            "내일은 짧게 걸으면서 루틴을 다시 연결해요.",
            {
              id: "item-workout-tomorrow",
              status: "adjusted",
            },
          ),
          date: "2026-06-17",
        },
      ],
    }),
  },
  {
    id: "schedule-changed-late-work",
    label: "Late work schedule change",
    scenario: "예상보다 늦게 퇴근해서 저녁과 운동을 동시에 조정해야 한다.",
    expectedPlannerBehavior: "남은 시간 기준으로 저녁과 운동을 모두 더 작게 재배치한다.",
    input: {
      currentPlan,
      todayItems,
      completedItemIds: ["item-breakfast", "item-lunch"],
      request: {
        planId: "plan-fixture-1",
        affectedDate: "2026-06-16",
        reason: "schedule_changed",
        note: "퇴근이 10시가 넘을 것 같아.",
      },
    },
    sampleOutput: createAdjustmentOutput({
      reason: "schedule_changed",
      summary: "늦은 퇴근 기준으로 저녁과 운동을 작게 줄입니다.",
      userMessage: "오늘 일정에 맞춰 아주 작게 이어가는 쪽으로 바꿀게요.",
      changedItemIds: ["item-dinner", "item-workout"],
      updatedTodayItems: [
        createMealItem(
          "dinner",
          "늦은 저녁",
          "소화가 편한 단백질과 따뜻한 음료 정도로 가볍게 먹어요.",
          {
            status: "adjusted",
          },
        ),
        createWorkoutItem("workout", "5분 정리 스트레칭", "잠들기 전 목과 허리만 가볍게 풀어요.", {
          status: "adjusted",
        }),
      ],
    }),
  },
  {
    id: "wants-gentler-plan",
    label: "Wants gentler plan",
    scenario: "사용자가 이유를 길게 설명하지 않고 더 쉬운 플랜을 원한다.",
    expectedPlannerBehavior: "추궁하지 않고 강도를 낮춘 오늘 플랜과 이후 조정 후보를 제안한다.",
    input: {
      currentPlan,
      todayItems,
      completedItemIds: [],
      request: {
        planId: "plan-fixture-1",
        affectedDate: "2026-06-16",
        reason: "want_replan",
        note: "오늘은 좀 더 쉽게 가고 싶어.",
      },
    },
    sampleOutput: createAdjustmentOutput({
      reason: "want_replan",
      summary: "오늘 플랜의 강도를 낮춰서 이어가기 쉽게 조정합니다.",
      userMessage: "좋아요. 오늘은 쉽게 이어가는 버전으로 다시 맞춰볼게요.",
      changedItemIds: ["item-breakfast", "item-dinner", "item-workout"],
      updatedTodayItems: [
        createMealItem(
          "breakfast",
          "간단한 아침",
          "바나나나 요거트처럼 바로 먹을 수 있는 걸로 시작해요.",
          {
            status: "adjusted",
          },
        ),
        createMealItem(
          "dinner",
          "쉬운 저녁",
          "편의점 샐러드와 단백질처럼 준비가 쉬운 조합으로 가요.",
          {
            status: "adjusted",
          },
        ),
        createWorkoutItem(
          "workout",
          "10분 걷기",
          "운동복을 갖추지 않아도 되는 산책으로 마무리해요.",
          {
            status: "adjusted",
          },
        ),
      ],
    }),
  },
  {
    id: "skipped-breakfast-recover-day",
    label: "Skipped breakfast recovers day",
    scenario: "아침을 또 건너뛰었고 점심 이후 플랜을 망치지 않고 싶어 한다.",
    expectedPlannerBehavior: "건너뛴 아침을 비난하지 않고 점심과 간식을 안정적으로 조정한다.",
    input: {
      currentPlan,
      todayItems,
      completedItemIds: [],
      request: {
        planId: "plan-fixture-1",
        affectedDate: "2026-06-16",
        reason: "meal_changed",
        note: "아침을 못 먹었어.",
      },
    },
    sampleOutput: createAdjustmentOutput({
      reason: "meal_changed",
      summary: "아침을 건너뛴 흐름에 맞춰 점심과 간식을 안정적으로 조정합니다.",
      userMessage: "지금부터 이어가면 돼요. 점심을 너무 세게 몰지 않도록 다시 맞출게요.",
      changedItemIds: ["item-lunch"],
      updatedTodayItems: [
        createMealItem(
          "lunch",
          "안정적인 점심",
          "밥은 평소 양으로 먹고 단백질 반찬을 먼저 챙겨요.",
          {
            status: "adjusted",
          },
        ),
      ],
    }),
  },
  {
    id: "normal-lunch-protect-social-meal",
    label: "Protect normal social lunch",
    scenario: "동료들과 점심을 먹어야 해서 점심 메뉴를 크게 바꿀 수 없다.",
    expectedPlannerBehavior: "사회적 점심을 유지하고 아침, 저녁, 운동을 주변에서 조정한다.",
    input: {
      currentPlan,
      todayItems,
      completedItemIds: ["item-breakfast"],
      request: {
        planId: "plan-fixture-1",
        affectedDate: "2026-06-16",
        reason: "meal_changed",
        note: "점심은 동료들이랑 일반식 먹어야 해.",
      },
    },
    sampleOutput: createAdjustmentOutput({
      reason: "meal_changed",
      summary: "점심은 유지하고 저녁과 걷기 강도를 조정합니다.",
      userMessage: "점심은 그대로 두고, 나머지를 현실적으로 맞추면 돼요.",
      changedItemIds: ["item-dinner", "item-workout"],
      updatedTodayItems: [
        createMealItem(
          "dinner",
          "점심 이후 균형 저녁",
          "저녁은 단백질과 채소 중심으로 간단히 먹어요.",
          {
            status: "adjusted",
          },
        ),
        createWorkoutItem(
          "workout",
          "식후 15분 걷기",
          "가능하면 저녁 뒤 짧게 걸어서 흐름을 이어가요.",
          {
            status: "adjusted",
          },
        ),
      ],
    }),
  },
] as const satisfies AdjustmentFixtureCase[];

export function getAdjustmentFixtureCase(id: AdjustmentFixtureCaseId) {
  return adjustmentFixtureCases.find((fixtureCase) => fixtureCase.id === id);
}

function createMealItem(
  slot: Extract<AiPlanItem["slot"], "breakfast" | "lunch" | "dinner" | "snack">,
  title: string,
  description: string,
  options: Partial<AiPlanItem> = {},
): AiPlanItem {
  return {
    id: options.id ?? `item-${slot}`,
    planId: "plan-fixture-1",
    date: "2026-06-16",
    type: "meal",
    slot,
    title,
    description,
    status: options.status ?? "pending",
  };
}

function createWorkoutItem(
  slot: Extract<AiPlanItem["slot"], "workout">,
  title: string,
  description: string,
  options: Partial<AiPlanItem> = {},
): AiPlanItem {
  return {
    id: options.id ?? `item-${slot}`,
    planId: "plan-fixture-1",
    date: "2026-06-16",
    type: "exercise",
    slot,
    title,
    description,
    intensity: "light",
    status: options.status ?? "pending",
  };
}

function createAdjustmentOutput(
  revision: Omit<AdjustTodayPlanOutput["revision"], "planId" | "affectedDate">,
): AdjustTodayPlanOutput {
  return {
    revision: {
      planId: "plan-fixture-1",
      affectedDate: "2026-06-16",
      ...revision,
    },
  };
}
