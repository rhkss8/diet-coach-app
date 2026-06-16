import type { LifestyleAnswers } from "@diet-coach/core";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { SegmentedChoice } from "../../shared/ui/SegmentedChoice";
import { useLifestyleStep } from "./useLifestyleStep";

type LifestyleStepProps = {
  onComplete: (answers: LifestyleAnswers) => void;
};

const paceOptions = [
  { label: "3개월 집중", value: "fast_3_months" },
  { label: "6개월 꾸준히", value: "steady_6_months" },
  { label: "지속 우선", value: "consistency_first" },
] as const;

const hardestPartOptions = [
  { label: "식사", value: "meal" },
  { label: "운동", value: "exercise" },
  { label: "둘 다", value: "both" },
] as const;

const exerciseExperienceOptions = [
  { label: "거의 없음", value: "none" },
  { label: "가끔 함", value: "some" },
  { label: "꾸준히 함", value: "consistent" },
] as const;

export function LifestyleStep({ onComplete }: LifestyleStepProps) {
  const { answers, canContinue, completeLifestyleStep, updateAnswer } =
    useLifestyleStep(onComplete);

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>온보딩 3/3</Text>
        <Text style={styles.title}>생활 패턴을 짧게 맞출게요</Text>
        <Text style={styles.description}>
          세 가지만 고르면 첫 플랜의 강도와 조정 여지를 현실적으로 잡을 수 있어요.
        </Text>
      </View>

      <View style={styles.form}>
        <SegmentedChoice
          label="원하는 속도"
          onChange={(value) => updateAnswer("pace", value)}
          options={paceOptions}
          value={answers.pace}
        />
        <SegmentedChoice
          label="가장 어려운 부분"
          onChange={(value) => updateAnswer("hardestPart", value)}
          options={hardestPartOptions}
          value={answers.hardestPart}
        />
        <SegmentedChoice
          label="운동 경험"
          onChange={(value) => updateAnswer("exerciseExperience", value)}
          options={exerciseExperienceOptions}
          value={answers.exerciseExperience}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.helperText}>
          이 답변은 완벽한 계획보다 다시 이어갈 수 있는 계획을 만드는 데 사용해요.
        </Text>
        <PrimaryButton
          disabled={!canContinue}
          label="첫 플랜 만들기"
          onPress={completeLifestyleStep}
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
    gap: 20,
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
