import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import type { UserProfileInput } from "@diet-coach/core";

import { createAnalyticsEvent } from "@diet-coach/core";

import { BasicProfileStep } from "../features/onboarding";

export function AppRoot() {
  const [profile, setProfile] = useState<UserProfileInput | null>(null);

  function completeProfile(profileInput: UserProfileInput) {
    createAnalyticsEvent("PROFILE_STEP_COMPLETED", {});
    setProfile(profileInput);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      {profile ? (
        <ProfileStepCompleted profile={profile} />
      ) : (
        <BasicProfileStep onComplete={completeProfile} />
      )}
    </SafeAreaView>
  );
}

function ProfileStepCompleted({ profile }: { profile: UserProfileInput }) {
  return (
    <View style={styles.completedContent}>
      <Text style={styles.eyebrow}>기본 정보 저장됨</Text>
      <Text style={styles.title}>이제 목표를 맞출 차례예요</Text>
      <Text style={styles.description}>
        {profile.age}세, {profile.heightCm}cm, 현재 {profile.currentWeightKg}kg 기준으로 다음
        단계에서 목표를 설정합니다.
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
