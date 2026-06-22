import type { ComponentType, ReactNode } from "react";
import { ChevronLeft, Check, Leaf, Paperclip, RotateCcw, Send, X } from "lucide-react-native";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "./design-system";

export type PlannerIcon = ComponentType<{
  color?: string;
  size?: number;
  strokeWidth?: number;
}>;

type AppHeaderProps = {
  actions?: ReactNode;
  kicker?: string;
  onBack?: () => void;
};

type BackButtonProps = {
  label?: string;
  onLongPress?: () => void;
  onPress: () => void;
};

type BrandLeafProps = {
  backgroundColor?: string;
  color?: string;
  size?: number;
};

type PlannerBrandRowProps = {
  label?: string;
};

type CompactBrandMarkProps = {
  label?: string;
};

/**
 * Renders the Figma Make Leaf icon in the circular brand container used by the reference screens.
 */
export function BrandLeaf({
  backgroundColor = theme.colors.primary,
  color = theme.colors.surface,
  size = 24,
}: BrandLeafProps) {
  return (
    <View
      style={[
        styles.brandLeaf,
        {
          backgroundColor,
          borderRadius: size / 2,
          height: size,
          width: size,
        },
      ]}
    >
      <Leaf color={color} size={Math.round(size * 0.48)} strokeWidth={2} />
    </View>
  );
}

/**
 * Shows the small brand row used by the Figma Make login and onboarding screens.
 */
export function PlannerBrandRow({ label = "TARS · Recovery Planner" }: PlannerBrandRowProps) {
  return (
    <View style={styles.brandRow}>
      <BrandLeaf
        backgroundColor={theme.colors.primarySoft}
        color={theme.colors.primary}
        size={28}
      />
      <Text style={styles.brandRowText}>{label}</Text>
    </View>
  );
}

/**
 * Keeps page-level back affordances visually and semantically consistent.
 */
export function BackButton({ label = "돌아가기", onLongPress, onPress }: BackButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onLongPress={onLongPress}
      onPress={onPress}
      style={styles.backButton}
    >
      <ChevronLeft color={theme.colors.primary} size={18} strokeWidth={2} />
      <Text style={styles.backButtonText}>{label}</Text>
    </Pressable>
  );
}

/**
 * Shows the compact inline brand mark used by dense planner headers.
 */
export function CompactBrandMark({ label = "TARS" }: CompactBrandMarkProps) {
  return (
    <View style={styles.compactBrand}>
      <Leaf color={theme.colors.primary} size={12} strokeWidth={2} />
      <Text style={styles.compactBrandText}>{label}</Text>
    </View>
  );
}

/**
 * Provides the compact app chrome used by Figma Make screens.
 */
export function AppHeader({ actions, kicker = "TARS", onBack }: AppHeaderProps) {
  return (
    <View style={styles.appHeader}>
      <View style={styles.appHeaderSide}>{onBack ? <BackButton onPress={onBack} /> : null}</View>
      <View style={styles.brand}>
        <BrandLeaf />
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
  icon?: PlannerIcon;
  label: string;
};

/**
 * Labels a plan section with the small uppercase rhythm from the Figma Make reference.
 */
export function SectionHeader({ icon: Icon, label }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      {Icon ? <Icon color={theme.colors.muted} size={11} strokeWidth={2} /> : null}
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
  attachments?: ChatInputAttachment[];
  children: string;
  role: "assistant" | "user";
};

/**
 * Matches the Figma Make chat bubble layout with an assistant mark and asymmetric corners.
 */
export function ChatBubble({ attachments = [], children, role }: ChatBubbleProps) {
  const isAssistant = role === "assistant";

  return (
    <View style={[styles.chatRow, isAssistant ? styles.assistantRow : styles.userRow]}>
      {isAssistant ? (
        <View style={styles.chatAvatar}>
          <BrandLeaf
            backgroundColor={theme.colors.primarySoft}
            color={theme.colors.primary}
            size={24}
          />
        </View>
      ) : null}
      <View style={[styles.chatBubble, isAssistant ? styles.assistantBubble : styles.userBubble]}>
        <Text style={[styles.chatBubbleText, !isAssistant && styles.userBubbleText]}>
          {children}
        </Text>
        {attachments.length > 0 ? (
          <View style={styles.chatAttachmentList}>
            {attachments.map((attachment) => (
              <View
                key={attachment.id}
                style={[styles.chatAttachmentChip, !isAssistant && styles.userAttachmentChip]}
              >
                <Paperclip
                  color={isAssistant ? theme.colors.primary : theme.colors.surface}
                  size={11}
                  strokeWidth={2}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.chatAttachmentText, !isAssistant && styles.userAttachmentText]}
                >
                  {attachment.name}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

type ChatInputAttachment = {
  id: string;
  name: string;
  sizeBytes?: number;
};

type PlannerChatInputProps = {
  attachments?: ChatInputAttachment[];
  disabled?: boolean;
  maxAttachments?: number;
  onAddAttachment?: () => void;
  onChangeText: (value: string) => void;
  onRemoveAttachment?: (attachmentId: string) => void;
  onSubmit: () => void;
  placeholder: string;
  value: string;
};

/**
 * Keeps chat entry as the bottom docked control from the Figma Make chat screens.
 */
export function PlannerChatInput({
  attachments = [],
  disabled = false,
  maxAttachments = 3,
  onAddAttachment,
  onChangeText,
  onRemoveAttachment,
  onSubmit,
  placeholder,
  value,
}: PlannerChatInputProps) {
  const canAddAttachment = Boolean(onAddAttachment) && attachments.length < maxAttachments;

  return (
    <View style={styles.chatInputPanel}>
      {attachments.length > 0 ? (
        <View style={styles.chatInputAttachmentList}>
          {attachments.map((attachment) => (
            <Pressable
              accessibilityLabel={`${attachment.name} 첨부 제거`}
              accessibilityRole="button"
              key={attachment.id}
              onPress={() => onRemoveAttachment?.(attachment.id)}
              style={styles.chatInputAttachmentChip}
            >
              <Paperclip color={theme.colors.primary} size={11} strokeWidth={2} />
              <Text numberOfLines={1} style={styles.chatInputAttachmentText}>
                {attachment.name}
              </Text>
              <X color={theme.colors.muted} size={12} strokeWidth={2} />
            </Pressable>
          ))}
        </View>
      ) : null}
      <View style={styles.chatInputShell}>
        {onAddAttachment ? (
          <Pressable
            accessibilityLabel="파일 첨부"
            accessibilityRole="button"
            disabled={!canAddAttachment}
            onPress={onAddAttachment}
            style={[styles.attachButton, !canAddAttachment && styles.disabledAttachButton]}
          >
            <Paperclip
              color={canAddAttachment ? theme.colors.primary : theme.colors.muted}
              size={16}
              strokeWidth={2}
            />
          </Pressable>
        ) : null}
        <TextInput
          accessibilityLabel="상담 메시지 입력"
          blurOnSubmit={false}
          multiline
          onChangeText={onChangeText}
          onSubmitEditing={() => {
            if (!disabled) {
              onSubmit();
            }
          }}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.muted}
          returnKeyType="send"
          style={styles.chatInput}
          value={value}
        />
        <Pressable
          accessibilityLabel={disabled ? "메시지 전송 불가" : "메시지 전송"}
          accessibilityRole="button"
          disabled={disabled}
          onPress={onSubmit}
          style={[styles.sendButton, disabled && styles.disabledSendButton]}
        >
          <Send
            color={disabled ? theme.colors.muted : theme.colors.surface}
            size={13}
            strokeWidth={2}
          />
        </Pressable>
      </View>
    </View>
  );
}

export type PlanProposalItem = {
  detail: string;
  title: string;
};

type PlanProposalCardProps = {
  actionLabel: string;
  description: string;
  items: PlanProposalItem[];
  onApprove: () => void;
  onDismiss?: () => void;
  title: string;
  typeLabel: string;
};

/**
 * Represents structured planner output as the approval card from the Figma Make proposal screen.
 */
export function PlanProposalCard({
  actionLabel,
  description,
  items,
  onApprove,
  onDismiss,
  title,
  typeLabel,
}: PlanProposalCardProps) {
  return (
    <View style={styles.proposalCard}>
      <View style={styles.proposalHeader}>
        <Leaf color={theme.colors.primary} size={12} strokeWidth={2} />
        <Text style={styles.proposalKicker}>TARS 제안</Text>
        <Text style={styles.proposalType}>· {typeLabel}</Text>
      </View>
      <View style={styles.proposalBody}>
        <Text style={styles.proposalTitle}>{title}</Text>
        <Text style={styles.proposalDescription}>{description}</Text>
        <View style={styles.proposalItems}>
          {items.map((item) => (
            <View key={`${item.title}-${item.detail}`} style={styles.proposalItem}>
              <View style={styles.proposalRail} />
              <View style={styles.proposalItemCopy}>
                <Text style={styles.proposalItemTitle}>{item.title}</Text>
                <Text style={styles.proposalItemDetail}>{item.detail}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.proposalFootnote}>승인 전까지 현재 플랜은 바뀌지 않아요.</Text>
        <View style={styles.proposalActions}>
          {onDismiss ? (
            <Pressable
              accessibilityRole="button"
              onPress={onDismiss}
              style={styles.proposalSecondaryButton}
            >
              <Text style={styles.proposalSecondaryButtonText}>지금은 괜찮아요</Text>
            </Pressable>
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={onApprove}
            style={[styles.proposalButton, onDismiss && styles.proposalPrimaryButton]}
          >
            <Check color={theme.colors.surface} size={13} strokeWidth={3} />
            <Text style={styles.proposalButtonText}>{actionLabel}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

type ReasonTileProps = {
  icon: PlannerIcon;
  isSelected: boolean;
  label: string;
  note: string;
  onPress: () => void;
};

/**
 * Provides the two-column reason tile used by the recovery-reason source screen.
 */
export function ReasonTile({ icon, isSelected, label, note, onPress }: ReasonTileProps) {
  const Icon = icon;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.reasonTile, isSelected && styles.selectedReasonTile]}
    >
      <View style={[styles.reasonIcon, isSelected && styles.selectedReasonIcon]}>
        <Icon
          color={isSelected ? theme.colors.surface : theme.colors.subtle}
          size={15}
          strokeWidth={2}
        />
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
        {isCompleted ? <Check color={theme.colors.surface} size={12} strokeWidth={3} /> : null}
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
        <RotateCcw color={theme.colors.surface} size={15} strokeWidth={2} />
        <Text style={styles.recoveryButtonText}>{label}</Text>
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
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 2,
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
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.space.xs,
  },
  brandRowText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.8,
    lineHeight: 15,
    textTransform: "uppercase",
  },
  compactBrand: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  compactBrandText: {
    ...theme.type.eyebrow,
    color: theme.colors.primary,
  },
  brandLeaf: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
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
    height: 24,
    justifyContent: "center",
    marginRight: theme.space.xs,
    marginTop: 2,
    width: 24,
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
  chatAttachmentList: {
    gap: theme.space.xs,
    marginTop: theme.space.xs,
  },
  chatAttachmentChip: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.small,
    flexDirection: "row",
    gap: 5,
    maxWidth: 220,
    minHeight: 24,
    paddingHorizontal: theme.space.xs,
  },
  userAttachmentChip: {
    backgroundColor: "rgba(254, 252, 248, 0.18)",
  },
  chatAttachmentText: {
    color: theme.colors.primary,
    flexShrink: 1,
    fontSize: 11,
    lineHeight: 15,
  },
  userAttachmentText: {
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
  chatInputAttachmentList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.space.xs,
    paddingBottom: theme.space.xs,
  },
  chatInputAttachmentChip: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderColor: "rgba(61, 97, 66, 0.16)",
    borderRadius: theme.radius.small,
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    maxWidth: "100%",
    minHeight: 28,
    paddingHorizontal: theme.space.xs,
  },
  chatInputAttachmentText: {
    color: theme.colors.primary,
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 15,
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
  attachButton: {
    alignItems: "center",
    borderColor: theme.colors.border,
    borderRadius: 14,
    borderWidth: 1,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  disabledAttachButton: {
    backgroundColor: theme.colors.backgroundAlt,
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
    gap: 6,
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
  proposalItemCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  proposalItemTitle: {
    color: theme.colors.ink,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 17,
  },
  proposalItemDetail: {
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 16,
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
    flex: 1,
    flexDirection: "row",
    gap: 6,
    minHeight: 42,
    justifyContent: "center",
  },
  proposalActions: {
    flexDirection: "row",
    gap: theme.space.xs,
  },
  proposalPrimaryButton: {
    flex: 2,
  },
  proposalButtonText: {
    color: theme.colors.surface,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
  },
  proposalSecondaryButton: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    flex: 1,
    minHeight: 42,
    justifyContent: "center",
  },
  proposalSecondaryButtonText: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "600",
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
    minHeight: 62,
    paddingHorizontal: theme.space.md,
    paddingVertical: 10,
  },
  completedPlanItem: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: "rgba(61, 97, 66, 0.18)",
  },
  skippedPlanItem: {
    backgroundColor: theme.colors.backgroundAlt,
    opacity: 0.65,
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
  planItemCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  planItemTitle: {
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 19,
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
    paddingVertical: 6,
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
    paddingBottom: 40,
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.sm,
  },
  recoveryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.warm,
    borderRadius: theme.radius.large,
    flexDirection: "row",
    gap: theme.space.xs,
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
