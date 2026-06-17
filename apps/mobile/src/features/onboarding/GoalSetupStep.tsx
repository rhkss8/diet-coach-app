import type { GoalInput, UserProfileInput } from "@diet-coach/core";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { FormTextField } from "../../shared/ui/FormTextField";
import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { CalendarDatePicker } from "./CalendarDatePicker";
import { getTargetDateRange, normalizeGoalWeightInput } from "./goal-step";
import { useGoalSetupStep } from "./useGoalSetupStep";

type GoalSetupStepProps = {
  profile: UserProfileInput;
  onComplete: (goal: GoalInput) => void;
};

export function GoalSetupStep({ onComplete, profile }: GoalSetupStepProps) {
  const { canContinue, completeGoalSetupStep, draft, errors, updateDraft } = useGoalSetupStep(
    profile,
    onComplete,
  );
  const targetDateRange = getTargetDateRange();

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>온보딩 2/3</Text>
        <Text style={styles.title}>목표를 정해볼게요</Text>
        <Text style={styles.description}>
          지금 체중 {profile.currentWeightKg}kg 기준으로 첫 7일 플랜을 만들 목표를 입력해주세요.
        </Text>
      </View>

      <View style={styles.form}>
        <FormTextField
          error={errors.targetWeightKg}
          inputMode="numeric"
          keyboardType="decimal-pad"
          label="목표 체중"
          maxLength={5}
          onChangeText={(value) => updateDraft("targetWeightKg", normalizeGoalWeightInput(value))}
          placeholder="예: 66"
          value={draft.targetWeightKg}
        />
        <CalendarDatePicker
          error={errors.targetDate}
          label="목표 날짜"
          maxDate={targetDateRange.maxDate}
          minDate={targetDateRange.minDate}
          onChange={(value) => updateDraft("targetDate", value)}
          value={draft.targetDate}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.helperText}>
          목표는 나중에 다시 바꿀 수 있어요. 지금은 플랜의 방향을 잡는 용도로만 사용합니다.
        </Text>
        <PrimaryButton
          disabled={!canContinue}
          label="생활 패턴으로 계속"
          onPress={completeGoalSetupStep}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F8F7F4",
    flex: 1,
  },
  content: {
    gap: 24,
    padding: 24,
    paddingBottom: 36,
  },
  header: {
    gap: 10,
    paddingTop: 12,
  },
  eyebrow: {
    color: "#5E7664",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  title: {
    color: "#1F2A24",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 36,
  },
  description: {
    color: "#53645A",
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    gap: 18,
  },
  footer: {
    gap: 14,
  },
  helperText: {
    color: "#657269",
    fontSize: 14,
    lineHeight: 20,
  },
});
