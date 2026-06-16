import type { AdjustTodayPlanOutput } from "@diet-coach/ai";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { countChangedTodayItems, getChangedTodayItems } from "./revised-plan-review";

type RevisedPlanReviewScreenProps = {
  output: AdjustTodayPlanOutput;
  onApprove: () => void;
  onDismiss: () => void;
};

export function RevisedPlanReviewScreen({
  onApprove,
  onDismiss,
  output,
}: RevisedPlanReviewScreenProps) {
  const changedItems = getChangedTodayItems(output.revision);

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>조정안 검토</Text>
        <Text style={styles.title}>{output.revision.summary}</Text>
        <Text style={styles.description}>{output.revision.userMessage}</Text>
      </View>

      <View style={styles.summaryBand}>
        <Text style={styles.summaryTitle}>
          변경된 항목 {countChangedTodayItems(changedItems)}개
        </Text>
        <Text style={styles.summaryText}>승인하기 전까지 기존 플랜은 그대로 유지됩니다.</Text>
      </View>

      <View style={styles.section}>
        {changedItems.map((planItem) => (
          <View key={planItem.id ?? `${planItem.date}-${planItem.slot}`} style={styles.planItem}>
            <Text style={styles.planItemSlot}>{planItem.slot}</Text>
            <Text style={styles.planItemTitle}>{planItem.title}</Text>
            <Text style={styles.planItemDescription}>{planItem.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="조정안 승인" onPress={onApprove} />
        <PrimaryButton label="나중에 볼게요" onPress={onDismiss} />
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
    gap: 22,
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
  summaryBand: {
    backgroundColor: "#EAF1EC",
    borderRadius: 8,
    gap: 8,
    padding: 16,
  },
  summaryTitle: {
    color: "#24342B",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 24,
  },
  summaryText: {
    color: "#526057",
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    gap: 10,
  },
  planItem: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DFE5E0",
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
    padding: 14,
  },
  planItemSlot: {
    color: "#5E7664",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
  },
  planItemTitle: {
    color: "#1F2A24",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0,
  },
  planItemDescription: {
    color: "#53645A",
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    gap: 10,
  },
});
