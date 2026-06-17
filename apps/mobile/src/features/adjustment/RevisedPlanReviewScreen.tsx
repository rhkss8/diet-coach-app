import type { AdjustTodayPlanOutput } from "@diet-coach/ai";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { commonStyles, theme } from "../../shared/ui/design-system";
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
        <PrimaryButton label="나중에 볼게요" onPress={onDismiss} variant="ghost" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    gap: theme.space.lg,
    padding: theme.space.xl,
    paddingBottom: 36,
  },
  header: {
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radius.large,
    gap: theme.space.sm,
    padding: theme.space.lg,
  },
  eyebrow: {
    ...theme.type.eyebrow,
    color: "#B8CFC2",
  },
  title: {
    ...theme.type.title,
    color: theme.colors.white,
  },
  description: {
    ...theme.type.body,
    color: "#D8E0DA",
  },
  summaryBand: {
    ...commonStyles.insetCard,
    gap: theme.space.xs,
    padding: theme.space.md,
  },
  summaryTitle: {
    ...theme.type.sectionTitle,
    color: theme.colors.ink,
  },
  summaryText: {
    ...theme.type.supporting,
    color: theme.colors.muted,
  },
  section: {
    gap: theme.space.sm,
  },
  planItem: {
    ...commonStyles.card,
    gap: theme.space.xs,
    padding: theme.space.md,
  },
  planItemSlot: {
    ...theme.type.caption,
    color: theme.colors.primary,
    fontWeight: "900",
  },
  planItemTitle: {
    ...theme.type.body,
    color: theme.colors.ink,
    fontWeight: "900",
  },
  planItemDescription: {
    ...theme.type.supporting,
    color: theme.colors.muted,
  },
  actions: {
    alignItems: "flex-start",
    gap: theme.space.sm,
  },
});
