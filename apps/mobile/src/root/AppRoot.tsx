import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import type { GenerateInitialPlanOutput } from "@diet-coach/ai";
import type { GoalInput, LifestyleAnswers, UserProfileInput } from "@diet-coach/core";

import { generateMockInitialPlan } from "@diet-coach/ai";
import { OnboardingFlow } from "../features/onboarding";

type CompletedOnboarding = {
  profile: UserProfileInput;
  goal: GoalInput;
  lifestyleAnswers: LifestyleAnswers;
  initialPlanOutput: GenerateInitialPlanOutput;
};

export function AppRoot() {
  const [completedOnboarding, setCompletedOnboarding] = useState<CompletedOnboarding | null>(null);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      {completedOnboarding ? (
        <OnboardingCompleted result={completedOnboarding} />
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

function OnboardingCompleted({ result }: { result: CompletedOnboarding }) {
  return (
    <View style={styles.completedContent}>
      <Text style={styles.eyebrow}>목표 저장됨</Text>
      <Text style={styles.title}>이제 생활 패턴만 맞추면 돼요</Text>
      <Text style={styles.description}>
        현재 {result.profile.currentWeightKg}kg에서 {result.goal.targetWeightKg}kg까지,
        {result.goal.targetDate} 기준으로 {result.lifestyleAnswers.pace} 플랜을 준비합니다.
      </Text>
      <Text style={styles.description}>
        {result.initialPlanOutput.plan.items.length}개의 식사/운동 항목이 준비됐어요.
      </Text>
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
