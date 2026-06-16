import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import type { AiPlan, GenerateInitialPlanOutput } from "@diet-coach/ai";
import type { GoalInput, LifestyleAnswers, UserProfileInput } from "@diet-coach/core";

import { generateMockInitialPlan } from "@diet-coach/ai";
import { OnboardingFlow } from "../features/onboarding";
import { PlanApprovalScreen } from "../features/plan";

type CompletedOnboarding = {
  profile: UserProfileInput;
  goal: GoalInput;
  lifestyleAnswers: LifestyleAnswers;
  initialPlanOutput: GenerateInitialPlanOutput;
};

export function AppRoot() {
  const [completedOnboarding, setCompletedOnboarding] = useState<CompletedOnboarding | null>(null);
  const [approvedPlan, setApprovedPlan] = useState<AiPlan | null>(null);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      {approvedPlan ? (
        <PlanApproved plan={approvedPlan} />
      ) : completedOnboarding ? (
        <PlanApprovalScreen
          onApprove={() => setApprovedPlan(completedOnboarding.initialPlanOutput.plan)}
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

function completeOnboarding(
  result: Omit<CompletedOnboarding, "initialPlanOutput">,
): CompletedOnboarding {
  return {
    ...result,
    initialPlanOutput: generateMockInitialPlan(result),
  };
}

function PlanApproved({ plan }: { plan: AiPlan }) {
  return (
    <View style={styles.completedContent}>
      <Text style={styles.eyebrow}>플랜 승인됨</Text>
      <Text style={styles.title}>오늘 플랜으로 이어갈게요</Text>
      <Text style={styles.description}>{plan.items.length}개의 식사/운동 항목이 준비됐어요.</Text>
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
  description: {
    color: "#53645A",
    fontSize: 16,
    lineHeight: 24,
  },
});
