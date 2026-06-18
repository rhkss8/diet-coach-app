import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

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

type ScreenTitleBlockProps = {
  description?: string;
  eyebrow?: string;
  title: string;
};

/**
 * Renders the Figma Make page-title rhythm used by onboarding and recovery flows.
 */
export function ScreenTitleBlock({ description, eyebrow, title }: ScreenTitleBlockProps) {
  return (
    <View style={styles.titleBlock}>
      {eyebrow ? <Text style={styles.titleEyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.screenTitle}>{title}</Text>
      {description ? <Text style={styles.screenDescription}>{description}</Text> : null}
    </View>
  );
}

type ChatBubbleProps = {
  children: string;
  role: "assistant" | "user";
};

/**
 * Matches the Figma Make chat bubble layout with an assistant mark and asymmetric corners.
 */
export function ChatBubble({ children, role }: ChatBubbleProps) {
  const isAssistant = role === "assistant";

  return (
    <View style={[styles.chatRow, isAssistant ? styles.assistantRow : styles.userRow]}>
      {isAssistant ? (
        <View style={styles.chatAvatar}>
          <Text style={styles.chatAvatarText}>T</Text>
        </View>
      ) : null}
      <View style={[styles.chatBubble, isAssistant ? styles.assistantBubble : styles.userBubble]}>
        <Text style={[styles.chatBubbleText, !isAssistant && styles.userBubbleText]}>
          {children}
        </Text>
      </View>
    </View>
  );
}

type PlannerChatInputProps = {
  disabled?: boolean;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  value: string;
};

/**
 * Keeps chat entry as the bottom docked control from the Figma Make chat screens.
 */
export function PlannerChatInput({
  disabled = false,
  onChangeText,
  onSubmit,
  placeholder,
  value,
}: PlannerChatInputProps) {
  return (
    <View style={styles.chatInputPanel}>
      <View style={styles.chatInputShell}>
        <TextInput
          multiline
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.muted}
          style={styles.chatInput}
          value={value}
        />
        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          onPress={onSubmit}
          style={[styles.sendButton, disabled && styles.disabledSendButton]}
        >
          <Text style={styles.sendButtonText}>›</Text>
        </Pressable>
      </View>
    </View>
  );
}

type PlanProposalCardProps = {
  actionLabel: string;
  description: string;
  items: string[];
  onApprove: () => void;
  title: string;
  typeLabel: string;
};

/**
 * Represents structured AI output as the approval card from the Figma Make proposal screen.
 */
export function PlanProposalCard({
  actionLabel,
  description,
  items,
  onApprove,
  title,
  typeLabel,
}: PlanProposalCardProps) {
  return (
    <View style={styles.proposalCard}>
      <View style={styles.proposalHeader}>
        <Text style={styles.proposalKicker}>TARS 제안</Text>
        <Text style={styles.proposalType}>· {typeLabel}</Text>
      </View>
      <View style={styles.proposalBody}>
        <Text style={styles.proposalTitle}>{title}</Text>
        <Text style={styles.proposalDescription}>{description}</Text>
        <View style={styles.proposalItems}>
          {items.map((item) => (
            <View key={item} style={styles.proposalItem}>
              <View style={styles.proposalRail} />
              <Text style={styles.proposalItemText}>{item}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.proposalFootnote}>승인 전까지 현재 플랜은 바뀌지 않아요.</Text>
        <Pressable accessibilityRole="button" onPress={onApprove} style={styles.proposalButton}>
          <Text style={styles.proposalButtonText}>{actionLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

type ReasonTileProps = {
  isSelected: boolean;
  label: string;
  note: string;
  onPress: () => void;
};

/**
 * Provides the two-column reason tile used by the recovery-reason source screen.
 */
export function ReasonTile({ isSelected, label, note, onPress }: ReasonTileProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.reasonTile, isSelected && styles.selectedReasonTile]}
    >
      <View style={[styles.reasonIcon, isSelected && styles.selectedReasonIcon]}>
        <Text style={[styles.reasonIconText, isSelected && styles.selectedReasonIconText]}>
          {label.slice(0, 1)}
        </Text>
      </View>
      <Text style={[styles.reasonLabel, isSelected && styles.selectedReasonLabel]}>{label}</Text>
      <Text style={styles.reasonNote}>{note}</Text>
    </Pressable>
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
  titleBlock: {
    gap: theme.space.xs,
  },
  titleEyebrow: {
    ...theme.type.eyebrow,
    color: theme.colors.primary,
  },
  screenTitle: {
    ...theme.type.title,
    color: theme.colors.ink,
  },
  screenDescription: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  chatRow: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  assistantRow: {
    justifyContent: "flex-start",
  },
  userRow: {
    justifyContent: "flex-end",
  },
  chatAvatar: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 12,
    height: 24,
    justifyContent: "center",
    marginRight: theme.space.xs,
    marginTop: 2,
    width: 24,
  },
  chatAvatarText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 13,
  },
  chatBubble: {
    maxWidth: "78%",
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
  },
  assistantBubble: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.large,
    borderTopLeftRadius: 4,
    borderWidth: 1,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.large,
    borderTopRightRadius: 4,
  },
  chatBubbleText: {
    color: theme.colors.ink,
    fontSize: 13,
    lineHeight: 21,
  },
  userBubbleText: {
    color: theme.colors.surface,
  },
  chatInputPanel: {
    backgroundColor: theme.colors.background,
    borderTopColor: "rgba(42, 61, 46, 0.07)",
    borderTopWidth: 1,
    paddingBottom: 34,
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.sm,
  },
  chatInputShell: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.large,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.space.xs,
    minHeight: 50,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.xs,
  },
  chatInput: {
    color: theme.colors.ink,
    flex: 1,
    fontSize: 13,
    maxHeight: 92,
    minHeight: 34,
    textAlignVertical: "center",
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  disabledSendButton: {
    backgroundColor: theme.colors.backgroundAlt,
  },
  sendButtonText: {
    color: theme.colors.surface,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 22,
  },
  proposalCard: {
    backgroundColor: "#FAFCFA",
    borderColor: "rgba(61, 97, 66, 0.22)",
    borderRadius: theme.radius.large,
    borderWidth: 1.5,
    boxShadow: "0 3px 14px rgba(42, 61, 46, 0.1)",
    overflow: "hidden",
  },
  proposalHeader: {
    alignItems: "center",
    borderBottomColor: "rgba(61, 97, 66, 0.18)",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: theme.space.xs,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
  },
  proposalKicker: {
    ...theme.type.eyebrow,
    color: theme.colors.primary,
  },
  proposalType: {
    color: theme.colors.muted,
    fontSize: 10,
    lineHeight: 14,
  },
  proposalBody: {
    gap: theme.space.sm,
    padding: theme.space.md,
  },
  proposalTitle: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },
  proposalDescription: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    lineHeight: 19,
  },
  proposalItems: {
    gap: theme.space.xs,
  },
  proposalItem: {
    alignItems: "center",
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radius.small,
    flexDirection: "row",
    gap: theme.space.sm,
    paddingHorizontal: theme.space.sm,
    paddingVertical: theme.space.xs,
  },
  proposalRail: {
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
    height: 32,
    width: 3,
  },
  proposalItemText: {
    color: theme.colors.ink,
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 17,
  },
  proposalFootnote: {
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
  proposalButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.medium,
    minHeight: 42,
    justifyContent: "center",
  },
  proposalButtonText: {
    color: theme.colors.surface,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
  },
  reasonTile: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.large,
    borderWidth: 1,
    flex: 1,
    minHeight: 124,
    padding: theme.space.md,
  },
  selectedReasonTile: {
    backgroundColor: theme.colors.warmSoft,
    borderColor: theme.colors.warm,
  },
  reasonIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    marginBottom: theme.space.xs,
    width: 32,
  },
  selectedReasonIcon: {
    backgroundColor: theme.colors.warm,
  },
  reasonIconText: {
    color: theme.colors.subtle,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 17,
  },
  selectedReasonIconText: {
    color: theme.colors.surface,
  },
  reasonLabel: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  selectedReasonLabel: {
    color: theme.colors.warm,
  },
  reasonNote: {
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  progress: {
    gap: 6,
  },
  progressCopy: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    fontWeight: "700",
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
    height: 5,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    height: 5,
  },
  planItem: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.space.md,
    minHeight: 64,
    paddingHorizontal: theme.space.md,
    paddingVertical: 10,
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
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  skippedText: {
    color: theme.colors.muted,
    textDecorationLine: "line-through",
  },
  planItemDetail: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  skipButton: {
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radius.small,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 8,
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
    gap: theme.space.sm,
    paddingBottom: 20,
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.sm,
  },
  recoveryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.warm,
    borderRadius: theme.radius.medium,
    minHeight: 50,
    justifyContent: "center",
  },
  recoveryButtonText: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 19,
  },
  bottomHelper: {
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
});
