import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "./design-system";

type AppHeaderProps = {
  actions?: ReactNode;
  kicker?: string;
  onBack?: () => void;
};

/**
 * Provides the compact app chrome used by Figma Make screens.
 */
export function AppHeader({ actions, kicker = "TARS", onBack }: AppHeaderProps) {
  return (
    <View style={styles.appHeader}>
      <View style={styles.appHeaderSide}>
        {onBack ? (
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹ 돌아가기</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.brand}>
        <View style={styles.brandLeaf}>
          <Text style={styles.brandLeafText}>T</Text>
        </View>
        <Text style={styles.brandText}>{kicker}</Text>
      </View>
      <View style={[styles.appHeaderSide, styles.headerActions]}>{actions}</View>
    </View>
  );
}

type HeaderActionProps = {
  label: string;
  onPress: () => void;
};

/**
 * Renders a quiet top-bar action that keeps utility controls out of the main visual hierarchy.
 */
export function HeaderAction({ label, onPress }: HeaderActionProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.headerAction}>
      <Text style={styles.headerActionText}>{label}</Text>
    </Pressable>
  );
}

type SectionHeaderProps = {
  label: string;
};

/**
 * Labels a plan section with the small uppercase rhythm from the Figma Make reference.
 */
export function SectionHeader({ label }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionDot} />
      <Text style={styles.sectionLabel}>{label}</Text>
    </View>
  );
}

type PlannerProgressProps = {
  completedCount: number;
  completionRate: number;
  totalCount: number;
};

/**
 * Shows daily completion as a thin planner progress rail instead of a dashboard tile.
 */
export function PlannerProgress({
  completedCount,
  completionRate,
  totalCount,
}: PlannerProgressProps) {
  return (
    <View style={styles.progress}>
      <View style={styles.progressCopy}>
        <Text style={styles.progressLabel}>
          {totalCount}개 중 {completedCount}개 완료
        </Text>
        <Text style={styles.progressRate}>{completionRate}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${completionRate}%` }]} />
      </View>
    </View>
  );
}

type PlannerItemCardProps = {
  detail: string;
  isCompleted: boolean;
  isSkipped: boolean;
  onComplete: () => void;
  onSkip: () => void;
  title: string;
};

/**
 * Displays one executable plan item with the circular completion control from the reference UI.
 */
export function PlannerItemCard({
  detail,
  isCompleted,
  isSkipped,
  onComplete,
  onSkip,
  title,
}: PlannerItemCardProps) {
  return (
    <View
      style={[
        styles.planItem,
        isCompleted && styles.completedPlanItem,
        isSkipped && styles.skippedPlanItem,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        disabled={isSkipped}
        onPress={onComplete}
        style={[styles.checkButton, isCompleted && styles.checkedButton]}
      >
        {isCompleted ? <Text style={styles.checkMark}>✓</Text> : null}
      </Pressable>
      <View style={styles.planItemCopy}>
        <Text style={[styles.planItemTitle, isSkipped && styles.skippedText]}>{title}</Text>
        <Text style={styles.planItemDetail}>{detail}</Text>
      </View>
      {!isCompleted && !isSkipped ? (
        <Pressable accessibilityRole="button" onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>건너뜀</Text>
        </Pressable>
      ) : null}
      {isSkipped ? <Text style={styles.skippedLabel}>건너뜀</Text> : null}
    </View>
  );
}

type BottomActionPanelProps = {
  helperText: string;
  label: string;
  onPress: () => void;
};

/**
 * Keeps the recovery action persistent at the bottom of the main planner screen.
 */
export function BottomActionPanel({ helperText, label, onPress }: BottomActionPanelProps) {
  return (
    <View style={styles.bottomPanel}>
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.recoveryButton}>
        <Text style={styles.recoveryButtonText}>↻ {label}</Text>
      </Pressable>
      <Text style={styles.bottomHelper}>{helperText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  appHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  appHeaderSide: {
    flex: 1,
  },
  backButton: {
    alignSelf: "flex-start",
    minHeight: 32,
    justifyContent: "center",
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 13,
    lineHeight: 18,
  },
  brand: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.space.xs,
  },
  brandLeaf: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  brandLeafText: {
    color: theme.colors.surface,
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 14,
  },
  brandText: {
    ...theme.type.eyebrow,
    color: theme.colors.primary,
  },
  headerActions: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: theme.space.xs,
    justifyContent: "flex-end",
  },
  headerAction: {
    backgroundColor: "rgba(254, 252, 248, 0.72)",
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    minHeight: 30,
    justifyContent: "center",
    paddingHorizontal: theme.space.xs,
  },
  headerActionText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 15,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.space.xs,
    marginBottom: theme.space.xs,
  },
  sectionDot: {
    backgroundColor: theme.colors.muted,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  sectionLabel: {
    ...theme.type.eyebrow,
    color: theme.colors.muted,
  },
  progress: {
    gap: theme.space.xs,
  },
  progressCopy: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    lineHeight: 17,
  },
  progressRate: {
    color: theme.colors.primary,
    fontSize: 12,
    fontVariant: ["tabular-nums"],
    fontWeight: "700",
    lineHeight: 17,
  },
  progressTrack: {
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: 999,
    height: 6,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    height: 6,
  },
  planItem: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.space.sm,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
  },
  completedPlanItem: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: "rgba(61, 97, 66, 0.18)",
  },
  skippedPlanItem: {
    backgroundColor: theme.colors.backgroundAlt,
    opacity: 0.72,
  },
  checkButton: {
    alignItems: "center",
    borderColor: theme.colors.muted,
    borderRadius: 12,
    borderWidth: 1,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  checkedButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkMark: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 18,
  },
  planItemCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  planItemTitle: {
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  skippedText: {
    color: theme.colors.muted,
    textDecorationLine: "line-through",
  },
  planItemDetail: {
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  skipButton: {
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radius.small,
    paddingHorizontal: theme.space.sm,
    paddingVertical: theme.space.xs,
  },
  skipButtonText: {
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 15,
  },
  skippedLabel: {
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 15,
  },
  bottomPanel: {
    backgroundColor: theme.colors.background,
    borderTopColor: "rgba(42, 61, 46, 0.07)",
    borderTopWidth: 1,
    gap: theme.space.xs,
    paddingBottom: 34,
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.sm,
  },
  recoveryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.warm,
    borderRadius: theme.radius.large,
    minHeight: 52,
    justifyContent: "center",
  },
  recoveryButtonText: {
    color: theme.colors.surface,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  bottomHelper: {
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
});
