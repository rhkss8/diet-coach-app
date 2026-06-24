import type {
  AdjustmentReason,
  AdjustmentRequest,
  EntityId,
  GoalInput,
  ISODate,
  LifestyleAnswers,
  PlanItemIntensity,
  PlanItemSlot,
  PlanItemStatus,
  PlanItemType,
  UserProfileInput,
} from "@diet-coach/core";

export type { LifestyleAnswers } from "@diet-coach/core";

export type AiPlanItem = {
  foods?: AiPlanFood[];
  id?: EntityId;
  nutrition?: AiPlanNutrition;
  planId?: EntityId;
  date: ISODate;
  type: PlanItemType;
  slot: PlanItemSlot;
  title: string;
  description: string;
  intensity?: PlanItemIntensity;
  status?: PlanItemStatus;
};

export type AiPlanFood = {
  amount: string;
  name: string;
  caloriesKcal?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
};

export type AiPlanNutrition = {
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  source?: "estimated" | "user_provided" | "database" | "attachment_inferred";
  confidence?: "low" | "medium" | "high";
};

export type AiPlan = {
  id?: EntityId;
  goalId: EntityId;
  startDate: ISODate;
  endDate: ISODate;
  summary: string;
  items: AiPlanItem[];
};

export type PlanningGoalType =
  | "weight_loss"
  | "health_management"
  | "habit_improvement"
  | "routine_recovery"
  | "schedule_recovery"
  | "other";

export type PlanningCoachingPreference = "gentle" | "practical" | "direct";

export type PlanningContext = {
  managementIntent: {
    goalTypes: PlanningGoalType[];
    preferredMethods?: string[];
    reasonText?: string;
    coachingPreference?: PlanningCoachingPreference;
  };
  foodContext: {
    preferredFoods: string[];
    foodsToKeep: string[];
    avoidedFoods: string[];
    allergies: string[];
    eatingContext?: string[];
  };
  routineContext: {
    wakeTime?: string;
    mealWindows: {
      breakfast?: string;
      lunch?: string;
      dinner?: string;
      snack?: string;
    };
    workEndTime?: string;
    exerciseWindows: string[];
    riskMoments: string[];
    rawRoutineText: string;
  };
};

export type GenerateInitialPlanInput = {
  profile: UserProfileInput;
  goal: GoalInput;
  lifestyleAnswers: LifestyleAnswers;
  planningContext?: PlanningContext;
};

export type GenerateInitialPlanOutput = {
  plan: AiPlan;
  rationale: string;
  userMessage: string;
  adjustmentNotes: string[];
};

export type ChatPlannerMessage = {
  attachments?: ChatPlannerAttachment[];
  id: EntityId;
  role: "assistant" | "user";
  content: string;
};

export type ChatPlannerAttachment = {
  id: EntityId;
  name: string;
  mimeType?: string;
  sizeBytes?: number;
  storagePath?: string;
  uri?: string;
};

export type ChatPlannerConfirmation =
  | {
      action: "add_to_meal_plan";
      label: "식단에 추가하시겠습니까?";
    }
  | {
      action: "add_to_exercise_plan";
      label: "운동에 추가하시겠습니까?";
    }
  | {
      action: "revise_plan";
      label: "플랜을 수정하시겠습니까?";
    };

export type ChatPlannerResponse =
  | {
      type: "meal_plan_suggestion";
      message: string;
      suggestedItems: AiPlanItem[];
      confirmation: Extract<ChatPlannerConfirmation, { action: "add_to_meal_plan" }>;
    }
  | {
      type: "exercise_plan_suggestion";
      message: string;
      suggestedItems: AiPlanItem[];
      confirmation: Extract<ChatPlannerConfirmation, { action: "add_to_exercise_plan" }>;
    }
  | {
      type: "plan_revision_suggestion";
      message: string;
      revision: AdjustTodayPlanOutput["revision"];
      confirmation: Extract<ChatPlannerConfirmation, { action: "revise_plan" }>;
    }
  | {
      type: "clarification_question";
      message: string;
      question: string;
    };

export type GenerateChatPlannerResponseInput = {
  currentPlan?: AiPlan;
  messages: ChatPlannerMessage[];
  planningContext?: PlanningContext;
  todayDate: ISODate;
};

export type AdjustTodayPlanInput = {
  currentPlan: AiPlan;
  todayItems: AiPlanItem[];
  completedItemIds: EntityId[];
  request: Omit<AdjustmentRequest, "id" | "createdAt">;
  foodContext?: {
    text?: string;
    interpretedFoodName?: string;
    interpretedPortion?: string;
  };
  planningContext?: PlanningContext;
};

export type AdjustTodayPlanOutput = {
  revision: {
    planId: EntityId;
    affectedDate: ISODate;
    reason: AdjustmentReason;
    summary: string;
    userMessage: string;
    changedItemIds: EntityId[];
    updatedTodayItems: AiPlanItem[];
    updatedFutureItems?: AiPlanItem[];
  };
};

export type SummarizeProgressInput = {
  weekStartDate: ISODate;
  completedItemCount: number;
  skippedItemCount: number;
  revisionCount: number;
  recentCheckInNotes: string[];
};

export type SummarizeProgressOutput = {
  summary: string;
  suggestion: string;
};

export type AiValidationResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      errors: string[];
    };
