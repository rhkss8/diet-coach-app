import type { UserProfileInput } from "@diet-coach/core";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { FormTextField } from "../../shared/ui/FormTextField";
import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { SegmentedChoice } from "../../shared/ui/SegmentedChoice";
import { normalizeDecimalInput, normalizeIntegerInput } from "./profile-step";
import { useBasicProfileStep } from "./useBasicProfileStep";

type BasicProfileStepProps = {
  onComplete: (profile: UserProfileInput) => void;
};

const sexOptions = [
  { label: "여성", value: "female" },
  { label: "남성", value: "male" },
  { label: "기타", value: "other" },
  { label: "선택 안 함", value: "prefer_not_to_say" },
] as const;

export function BasicProfileStep({ onComplete }: BasicProfileStepProps) {
  const { canContinue, completeProfileStep, draft, errors, updateDraft } =
    useBasicProfileStep(onComplete);

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>온보딩 1/3</Text>
        <Text style={styles.title}>기본 정보를 알려주세요</Text>
        <Text style={styles.description}>
          복잡한 설문 대신 플랜을 만들 수 있는 최소 정보만 먼저 받을게요.
        </Text>
      </View>

      <View style={styles.form}>
        <FormTextField
          label="이름"
          onChangeText={(value) => updateDraft("name", value)}
          placeholder="선택 입력"
          value={draft.name}
        />
        <FormTextField
          error={errors.age}
          inputMode="numeric"
          keyboardType="number-pad"
          label="나이"
          maxLength={2}
          onChangeText={(value) => updateDraft("age", normalizeIntegerInput(value))}
          placeholder="예: 34"
          value={draft.age}
        />
        <SegmentedChoice
          label="성별"
          onChange={(value) => updateDraft("sex", value)}
          options={sexOptions}
          value={draft.sex}
        />
        <FormTextField
          error={errors.heightCm}
          inputMode="numeric"
          keyboardType="number-pad"
          label="키"
          maxLength={3}
          onChangeText={(value) => updateDraft("heightCm", normalizeIntegerInput(value))}
          placeholder="cm"
          value={draft.heightCm}
        />
        <FormTextField
          error={errors.currentWeightKg}
          inputMode="numeric"
          keyboardType="decimal-pad"
          label="현재 체중"
          maxLength={5}
          onChangeText={(value) => updateDraft("currentWeightKg", normalizeDecimalInput(value))}
          placeholder="kg"
          value={draft.currentWeightKg}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.helperText}>
          입력한 정보는 첫 7일 플랜을 현실적으로 맞추는 데만 사용해요.
        </Text>
        <PrimaryButton
          disabled={!canContinue}
          label="목표 설정으로 계속"
          onPress={completeProfileStep}
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
