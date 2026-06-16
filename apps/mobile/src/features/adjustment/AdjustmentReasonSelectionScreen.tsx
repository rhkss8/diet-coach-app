import type { AdjustmentReason } from "@diet-coach/core";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { SegmentedChoice } from "../../shared/ui/SegmentedChoice";
import { getAdjustmentReasonOptions } from "./adjustment-reason";

type AdjustmentReasonSelectionScreenProps = {
  onSelectReason: (reason: AdjustmentReason) => void;
  selectedReason?: AdjustmentReason;
};

export function AdjustmentReasonSelectionScreen({
  onSelectReason,
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
});
