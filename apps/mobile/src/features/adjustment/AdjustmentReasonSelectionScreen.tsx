import type { AdjustmentReason } from "@diet-coach/core";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { FormTextField } from "../../shared/ui/FormTextField";
import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { SegmentedChoice } from "../../shared/ui/SegmentedChoice";
import { getAdjustmentReasonOptions } from "./adjustment-reason";

type AdjustmentReasonSelectionScreenProps = {
  note: string;
  onChangeNote: (note: string) => void;
  onSelectReason: (reason: AdjustmentReason) => void;
  onSubmitNote: () => void;
  selectedReason?: AdjustmentReason;
};

export function AdjustmentReasonSelectionScreen({
  note,
  onChangeNote,
  onSelectReason,
  onSubmitNote,
  selectedReason = "meal_changed",
}: AdjustmentReasonSelectionScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>오늘 계획 조정</Text>
        <Text style={styles.title}>무엇이 달라졌나요?</Text>
        <Text style={styles.description}>
          사유만 빠르게 고르면 남은 하루 기준으로 다시 맞춰볼게요.
        </Text>
      </View>

      <View style={styles.reasonBand}>
        <SegmentedChoice
          label="조정 사유"
          onChange={onSelectReason}
          options={getAdjustmentReasonOptions()}
          value={selectedReason}
        />
      </View>

      <View style={styles.noteBand}>
        <FormTextField
          label="짧은 메모"
          multiline
          onChangeText={onChangeNote}
          placeholder="예: 점심을 많이 먹었어요. 오늘 운동은 어려울 것 같아요."
          value={note}
        />
        <Text style={styles.helperText}>
          메모는 선택 입력이에요. 비워도 다음 단계로 갈 수 있어요.
        </Text>
        <PrimaryButton label="조정안 만들기" onPress={onSubmitNote} />
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
  reasonBand: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DFE5E0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  noteBand: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DFE5E0",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  helperText: {
    color: "#657269",
    fontSize: 14,
    lineHeight: 20,
  },
});
