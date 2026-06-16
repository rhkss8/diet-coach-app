import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import type { GenerateInitialPlanOutput } from "@diet-coach/ai";
import type {
  AdjustmentReason,
  GoalInput,
  LifestyleAnswers,
  UserProfileInput,
} from "@diet-coach/core";

import { generateMockInitialPlan } from "@diet-coach/ai";
import { AdjustmentReasonSelectionScreen } from "../features/adjustment";
import { OnboardingFlow } from "../features/onboarding";
import { PlanApprovalScreen, useApprovedPlanPersistence } from "../features/plan";
import { TodayScreen } from "../features/today";
import { trackAnalyticsEvent } from "../shared/lib/analytics";

type CompletedOnboarding = {
  profile: UserProfileInput;
  goal: GoalInput;
  lifestyleAnswers: LifestyleAnswers;
  initialPlanOutput: GenerateInitialPlanOutput;
};

export function AppRoot() {
  const [completedOnboarding, setCompletedOnboarding] = useState<CompletedOnboarding | null>(null);
  const [isAdjustingToday, setIsAdjustingToday] = useState(false);
  const [selectedAdjustmentReason, setSelectedAdjustmentReason] = useState<
    AdjustmentReason | undefined
  >();
  const [adjustmentNote, setAdjustmentNote] = useState("");
  const [isAdjustmentNoteSubmitted, setIsAdjustmentNoteSubmitted] = useState(false);
  const { approvedPlanSnapshot, approvePlan, isHydratingApprovedPlan } =
    useApprovedPlanPersistence();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      {isHydratingApprovedPlan ? (
        <LoadingPlan />
      ) : isAdjustingToday ? (
        isAdjustmentNoteSubmitted ? (
          <AdjustmentNoteSubmitted />
        ) : (
          <AdjustmentReasonSelectionScreen
            note={adjustmentNote}
            onChangeNote={setAdjustmentNote}
            onSelectReason={(reason) => {
              setSelectedAdjustmentReason(reason);
              trackAnalyticsEvent("ADJUSTMENT_REASON_SELECTED", {
                userId: "local-user",
                planId: approvedPlanSnapshot?.plan.id ?? "local-plan",
                affectedDate: approvedPlanSnapshot?.plan.startDate ?? "local-date",
                reason,
              });
            }}
            onSubmitNote={() => {
              trackAnalyticsEvent("ADJUSTMENT_NOTE_SUBMITTED", {
                userId: "local-user",
                planId: approvedPlanSnapshot?.plan.id ?? "local-plan",
                affectedDate: approvedPlanSnapshot?.plan.startDate ?? "local-date",
                hasNote: adjustmentNote.trim().length > 0,
                reason: selectedAdjustmentReason,
              });
              setIsAdjustmentNoteSubmitted(true);
            }}
            selectedReason={selectedAdjustmentReason}
          />
        )
      ) : approvedPlanSnapshot ? (
        <TodayScreen
          onAdjustToday={() => {
            setIsAdjustingToday(true);
          }}
          plan={approvedPlanSnapshot.plan}
        />
      ) : completedOnboarding ? (
        <PlanApprovalScreen
          onApprove={() => {
            void approvePlan(completedOnboarding.initialPlanOutput.plan);
          }}
          output={completedOnboarding.initialPlanOutput}
        />
      ) : (
        <OnboardingFlow
          onComplete={(result) => setCompletedOnboarding(completeOnboarding(result))}
        />
      )}
    </SafeAreaView>
  );
}

function AdjustmentNoteSubmitted() {
  return (
    <View style={styles.completedContent}>
      <Text style={styles.eyebrow}>메모 저장됨</Text>
      <Text style={styles.title}>이제 조정안을 만들 차례예요</Text>
    </View>
  );
}

function completeOnboarding(
  result: Omit<CompletedOnboarding, "initialPlanOutput">,
): CompletedOnboarding {
  trackAnalyticsEvent("INITIAL_PLAN_GENERATION_STARTED", {
    userId: "local-user",
    goalId: "local-goal",
  });
  const initialPlanOutput = generateMockInitialPlan(result);

  trackAnalyticsEvent("INITIAL_PLAN_GENERATION_SUCCEEDED", {
    userId: "local-user",
    goalId: initialPlanOutput.plan.goalId,
    planId: initialPlanOutput.plan.id ?? "local-plan",
    itemCount: initialPlanOutput.plan.items.length,
  });

  return {
    ...result,
    initialPlanOutput,
  };
}

function LoadingPlan() {
  return (
    <View style={styles.completedContent}>
      <Text style={styles.eyebrow}>불러오는 중</Text>
      <Text style={styles.title}>저장된 플랜을 확인하고 있어요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F7F4",
  },
  completedContent: {
    flex: 1,
    justifyContent: "center",
    gap: 18,
    paddingHorizontal: 24,
  },
  eyebrow: {
    color: "#5E7664",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
  },
  title: {
    color: "#1F2A24",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 38,
  },
});
