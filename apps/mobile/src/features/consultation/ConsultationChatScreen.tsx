import type {
  ChatPlannerAttachment,
  ChatPlannerMessage,
  ChatPlannerResponse,
  PlanningGoalType,
} from "@diet-coach/ai";
import * as DocumentPicker from "expo-document-picker";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "../../shared/ui/design-system";
import {
  AppHeader,
  ChatBubble,
  HeaderAction,
  PlanProposalCard,
  PlannerChatInput,
} from "../../shared/ui/planner-components";
import { getChatProposalPreviewItems } from "./chat-proposal-preview";
import {
  createEmptyPlanningContextDraft,
  createPlanningContextFromDraft,
  canContinuePlanningContextStep,
  isPlanningContextDraftReady,
  planningGoalOptions,
  summarizePlanningContext,
  type PlanningContextGuideStep,
  type PlanningContextDraft,
} from "./planning-context";

type ConsultationChatScreenProps = {
  messages: ChatPlannerMessage[];
  onApproveResponse: (response: ChatPlannerResponse) => void;
  onBack?: () => void;
  onDismissPendingResponse: () => void;
  onOpenPlan: () => void;
  onSendMessage: (message: string, attachments?: ChatPlannerAttachment[]) => void;
  pendingResponse: ChatPlannerResponse | null;
  showPlanAction: boolean;
};

const MAX_CHAT_ATTACHMENTS = 3;

/**
 * Maps the active consultation route to the Figma Make chat and chat-proposal source screens.
 */
export function ConsultationChatScreen({
  messages,
  onApproveResponse,
  onBack,
  onDismissPendingResponse,
  onOpenPlan,
  onSendMessage,
  pendingResponse,
  showPlanAction,
}: ConsultationChatScreenProps) {
  const [draftMessage, setDraftMessage] = useState("");
  const [draftAttachments, setDraftAttachments] = useState<ChatPlannerAttachment[]>([]);
  const [planningDraft, setPlanningDraft] = useState(createEmptyPlanningContextDraft);
  const [hasSubmittedPlanningContext, setHasSubmittedPlanningContext] = useState(false);
  const [planningStep, setPlanningStep] = useState<PlanningContextGuideStep>("intent");
  const hasPendingConfirmation = pendingResponse ? "confirmation" in pendingResponse : false;
  const shouldShowPlanningGuide = !hasSubmittedPlanningContext;
  const canSendMessage =
    !hasPendingConfirmation && (draftMessage.trim().length > 0 || draftAttachments.length > 0);

  const appendDraftAttachments = useCallback((attachments: ChatPlannerAttachment[]) => {
    setDraftAttachments((currentAttachments) => {
      const existingAttachmentKeys = new Set(
        currentAttachments.map((attachment) => `${attachment.name}-${attachment.sizeBytes ?? ""}`),
      );
      const remainingSlots = MAX_CHAT_ATTACHMENTS - currentAttachments.length;
      const newAttachments = attachments
        .filter(
          (attachment) =>
            !existingAttachmentKeys.has(`${attachment.name}-${attachment.sizeBytes ?? ""}`),
        )
        .slice(0, remainingSlots);

      return [...currentAttachments, ...newAttachments];
    });
  }, []);

  useEffect(() => {
    if (hasPendingConfirmation || typeof window === "undefined") {
      return;
    }

    function handlePaste(event: ClipboardEvent) {
      const pastedFiles = Array.from(event.clipboardData?.files ?? []);
      const pastedImages = pastedFiles
        .filter((file) => file.type.startsWith("image/"))
        .map(createClipboardImageAttachment);

      if (pastedImages.length === 0) {
        return;
      }

      event.preventDefault();
      appendDraftAttachments(pastedImages);
    }

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [appendDraftAttachments, hasPendingConfirmation]);

  function submitMessage() {
    const message = draftMessage.trim() || "첨부 파일을 기준으로 식단을 분석해줘";
    const attachments = draftAttachments;

    if (!draftMessage.trim() && attachments.length === 0) {
      return;
    }

    setDraftMessage("");
    setDraftAttachments([]);
    onSendMessage(message, attachments);
  }

  async function pickAttachment() {
    if (hasPendingConfirmation) {
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: true,
      type: ["image/*", "application/pdf", "text/plain", "text/csv"],
    });

    if (result.canceled) {
      return;
    }

    appendDraftAttachments(result.assets.map(createChatAttachment));
  }

  function removeAttachment(attachmentId: string) {
    setDraftAttachments((currentAttachments) =>
      currentAttachments.filter((attachment) => attachment.id !== attachmentId),
    );
  }

  function submitPlanningContext() {
    if (!isPlanningContextDraftReady(planningDraft)) {
      return;
    }

    setHasSubmittedPlanningContext(true);
    onSendMessage(summarizePlanningContext(createPlanningContextFromDraft(planningDraft)));
  }

  function updatePlanningDraft(nextDraft: Partial<PlanningContextDraft>) {
    setPlanningDraft((currentDraft) => ({
      ...currentDraft,
      ...nextDraft,
    }));
  }

  function toggleGoalType(goalType: PlanningGoalType) {
    setPlanningDraft((currentDraft) => {
      const hasGoalType = currentDraft.goalTypes.includes(goalType);

      return {
        ...currentDraft,
        goalTypes: hasGoalType
          ? currentDraft.goalTypes.filter((currentGoalType) => currentGoalType !== goalType)
          : [...currentDraft.goalTypes, goalType],
      };
    });
  }

  function continuePlanningGuide() {
    if (!canContinuePlanningContextStep(planningDraft, planningStep)) {
      return;
    }

    if (planningStep === "intent") {
      setPlanningStep("food");
      return;
    }

    if (planningStep === "food") {
      setPlanningStep("routine");
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <AppHeader
          actions={showPlanAction ? <HeaderAction label="오늘 플랜" onPress={onOpenPlan} /> : null}
          kicker="TARS · 플랜 상담"
          onBack={onBack}
        />
      </View>

      <ScrollView contentContainerStyle={styles.messages} style={styles.messageList}>
        {messages.map((message) => (
          <ChatBubble
            attachments={message.attachments}
            key={message.id}
            role={message.role === "assistant" ? "assistant" : "user"}
          >
            {message.content}
          </ChatBubble>
        ))}

        {shouldShowPlanningGuide ? (
          <View style={styles.planningGuide}>
            <View style={styles.guideHeader}>
              <Text style={styles.guideKicker}>첫 플랜 준비</Text>
              <Text style={styles.guideTitle}>당신의 하루에 맞춰볼게요.</Text>
            </View>

            {planningStep === "intent" ? (
              <View style={styles.guideField}>
                <View style={styles.guideQuestionHeader}>
                  <Text style={styles.guideLabel}>어떤 관리가 필요한가요?</Text>
                  <Text style={styles.requiredBadge}>필수</Text>
                </View>
                <View style={styles.goalChips}>
                  {planningGoalOptions.map((option) => {
                    const isSelected = planningDraft.goalTypes.includes(option.value);

                    return (
                      <Pressable
                        accessibilityRole="button"
                        key={option.value}
                        onPress={() => toggleGoalType(option.value)}
                        style={[styles.goalChip, isSelected && styles.goalChipSelected]}
                      >
                        <Text
                          style={[styles.goalChipText, isSelected && styles.goalChipTextSelected]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <TextInput
                  multiline
                  onChangeText={(reasonText) => updatePlanningDraft({ reasonText })}
                  placeholder="요즘 가장 어려운 점은 선택으로 적어주세요."
                  placeholderTextColor={theme.colors.muted}
                  style={styles.guideInput}
                  value={planningDraft.reasonText}
                />
                <Pressable
                  accessibilityRole="button"
                  disabled={!canContinuePlanningContextStep(planningDraft, planningStep)}
                  onPress={continuePlanningGuide}
                  style={[
                    styles.guideSubmitButton,
                    !canContinuePlanningContextStep(planningDraft, planningStep) &&
                      styles.guideSubmitButtonDisabled,
                  ]}
                >
                  <Text style={styles.guideSubmitButtonText}>다음</Text>
                </Pressable>
              </View>
            ) : null}

            {planningStep === "food" ? (
              <View style={styles.guideField}>
                <View style={styles.guideQuestionHeader}>
                  <Text style={styles.guideLabel}>먹고 싶은 음식과 피해야 할 음식</Text>
                  <Text style={styles.optionalBadge}>선택</Text>
                </View>
                <TextInput
                  onChangeText={(foodsToKeepText) => updatePlanningDraft({ foodsToKeepText })}
                  placeholder="관리하면서도 먹고 싶은 음식"
                  placeholderTextColor={theme.colors.muted}
                  style={styles.guideInput}
                  value={planningDraft.foodsToKeepText}
                />
                <TextInput
                  onChangeText={(preferredFoodsText) => updatePlanningDraft({ preferredFoodsText })}
                  placeholder="좋아하는 음식"
                  placeholderTextColor={theme.colors.muted}
                  style={styles.guideInput}
                  value={planningDraft.preferredFoodsText}
                />
                <TextInput
                  onChangeText={(avoidedFoodsText) => updatePlanningDraft({ avoidedFoodsText })}
                  placeholder="피하고 싶은 음식"
                  placeholderTextColor={theme.colors.muted}
                  style={styles.guideInput}
                  value={planningDraft.avoidedFoodsText}
                />
                <TextInput
                  onChangeText={(allergiesText) => updatePlanningDraft({ allergiesText })}
                  placeholder="알레르기나 소화가 불편한 음식"
                  placeholderTextColor={theme.colors.muted}
                  style={styles.guideInput}
                  value={planningDraft.allergiesText}
                />
                <Pressable
                  accessibilityRole="button"
                  onPress={continuePlanningGuide}
                  style={styles.guideSubmitButton}
                >
                  <Text style={styles.guideSubmitButtonText}>다음</Text>
                </Pressable>
              </View>
            ) : null}

            {planningStep === "routine" ? (
              <View style={styles.guideField}>
                <View style={styles.guideQuestionHeader}>
                  <Text style={styles.guideLabel}>하루 루틴</Text>
                  <Text style={styles.requiredBadge}>필수</Text>
                </View>
                <TextInput
                  multiline
                  onChangeText={(routineText) => updatePlanningDraft({ routineText })}
                  placeholder="예: 8시 기상, 11시 점심, 21시 퇴근"
                  placeholderTextColor={theme.colors.muted}
                  style={styles.guideInput}
                  value={planningDraft.routineText}
                />
                <TextInput
                  onChangeText={(exerciseWindowsText) =>
                    updatePlanningDraft({ exerciseWindowsText })
                  }
                  placeholder="운동 가능한 시간은 선택으로 적어주세요."
                  placeholderTextColor={theme.colors.muted}
                  style={styles.guideInput}
                  value={planningDraft.exerciseWindowsText}
                />
                <Pressable
                  accessibilityRole="button"
                  disabled={!isPlanningContextDraftReady(planningDraft)}
                  onPress={submitPlanningContext}
                  style={[
                    styles.guideSubmitButton,
                    !isPlanningContextDraftReady(planningDraft) && styles.guideSubmitButtonDisabled,
                  ]}
                >
                  <Text style={styles.guideSubmitButtonText}>이 기준으로 플랜 맞추기</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        ) : null}

        {pendingResponse ? (
          "confirmation" in pendingResponse ? (
            <PlanProposalCard
              actionLabel={getConfirmationActionLabel(pendingResponse)}
              description={pendingResponse.message}
              items={getChatProposalPreviewItems(pendingResponse)}
              onApprove={() => onApproveResponse(pendingResponse)}
              onDismiss={onDismissPendingResponse}
              title={getProposalTitle(pendingResponse)}
              typeLabel={getResponseTypeLabel(pendingResponse)}
            />
          ) : (
            <Pressable style={styles.questionCard}>
              <Text style={styles.questionKicker}>추가 질문</Text>
              <Text style={styles.questionText}>{pendingResponse.question}</Text>
            </Pressable>
          )
        ) : null}
      </ScrollView>

      <PlannerChatInput
        attachments={draftAttachments}
        disabled={!canSendMessage}
        inputDisabled={hasPendingConfirmation}
        maxAttachments={MAX_CHAT_ATTACHMENTS}
        onAddAttachment={pickAttachment}
        onChangeText={setDraftMessage}
        onRemoveAttachment={removeAttachment}
        onSubmit={submitMessage}
        placeholder={
          hasPendingConfirmation
            ? "제안을 먼저 승인하거나 다시 제안받아 주세요."
            : "편하게 이야기해 주세요..."
        }
        value={draftMessage}
      />
    </View>
  );
}

function createChatAttachment(asset: DocumentPicker.DocumentPickerAsset): ChatPlannerAttachment {
  return {
    id: `attachment-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: asset.name,
    mimeType: asset.mimeType,
    sizeBytes: asset.size,
    uri: asset.uri,
  };
}

function createClipboardImageAttachment(file: File): ChatPlannerAttachment {
  const pastedAt = Date.now();

  return {
    id: `attachment-${pastedAt}-${Math.random().toString(36).slice(2)}`,
    name: file.name || `clipboard-image-${pastedAt}.png`,
    mimeType: file.type,
    sizeBytes: file.size,
    uri: URL.createObjectURL(file),
  };
}

function getProposalTitle(
  response: Exclude<ChatPlannerResponse, { type: "clarification_question" }>,
) {
  if (response.type === "plan_revision_suggestion") {
    return response.revision.summary;
  }

  return response.suggestedItems.at(0)?.title ?? "상담 기반 플랜 제안";
}

function getConfirmationActionLabel(
  response: Exclude<ChatPlannerResponse, { type: "clarification_question" }>,
) {
  if (response.confirmation.action === "add_to_meal_plan") {
    return "식단에 추가하기";
  }

  if (response.confirmation.action === "add_to_exercise_plan") {
    return "운동에 추가하기";
  }

  return "이 수정안 승인하기";
}

function getResponseTypeLabel(response: ChatPlannerResponse) {
  if (response.type === "meal_plan_suggestion") {
    return "식단 패치";
  }

  if (response.type === "exercise_plan_suggestion") {
    return "운동 패치";
  }

  if (response.type === "plan_revision_suggestion") {
    return "수정 패치";
  }

  return "추가 질문";
}
const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  topBar: {
    borderBottomColor: "rgba(42, 61, 46, 0.07)",
    borderBottomWidth: 1,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
  },
  messageList: {
    flex: 1,
  },
  messages: {
    flexGrow: 1,
    gap: theme.space.sm,
    padding: theme.space.md,
  },
  questionCard: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: "rgba(61, 97, 66, 0.15)",
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    gap: theme.space.xs,
    padding: theme.space.md,
  },
  questionKicker: {
    ...theme.type.eyebrow,
    color: theme.colors.primary,
  },
  questionText: {
    color: theme.colors.primary,
    fontSize: 12,
    lineHeight: 18,
  },
  planningGuide: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.large,
    borderWidth: 1,
    gap: theme.space.md,
    padding: theme.space.md,
  },
  guideHeader: {
    gap: 4,
  },
  guideKicker: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
  },
  guideTitle: {
    color: theme.colors.ink,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 26,
  },
  guideField: {
    gap: theme.space.xs,
  },
  guideQuestionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.space.xs,
    justifyContent: "space-between",
  },
  guideLabel: {
    color: theme.colors.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  requiredBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.small,
    color: theme.colors.surface,
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    overflow: "hidden",
    paddingHorizontal: theme.space.xs,
    paddingVertical: 2,
  },
  optionalBadge: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: "rgba(61, 97, 66, 0.15)",
    borderRadius: theme.radius.small,
    borderWidth: 1,
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    overflow: "hidden",
    paddingHorizontal: theme.space.xs,
    paddingVertical: 2,
  },
  goalChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.space.xs,
  },
  goalChip: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: theme.space.sm,
  },
  goalChipSelected: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  goalChipText: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: "800",
  },
  goalChipTextSelected: {
    color: theme.colors.primaryPressed,
  },
  guideInput: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    color: theme.colors.ink,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 42,
    outlineStyle: "none" as never,
    paddingHorizontal: theme.space.sm,
    paddingVertical: theme.space.xs,
  },
  guideSubmitButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.small,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: theme.space.md,
  },
  guideSubmitButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  guideSubmitButtonText: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: "800",
  },
});
