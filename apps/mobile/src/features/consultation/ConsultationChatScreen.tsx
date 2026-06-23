import type {
  ChatPlannerAttachment,
  ChatPlannerMessage,
  ChatPlannerResponse,
  PlanningGoalType,
} from "@diet-coach/ai";
import * as DocumentPicker from "expo-document-picker";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
  isGeneratingResponse?: boolean;
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
  isGeneratingResponse = false,
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
    !hasPendingConfirmation &&
    !isGeneratingResponse &&
    (shouldShowPlanningGuide
      ? canSubmitPlanningGuideMessage(planningStep, draftMessage)
      : draftMessage.trim().length > 0 || draftAttachments.length > 0);

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
    if (shouldShowPlanningGuide) {
      submitPlanningGuideAnswer();
      return;
    }

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

  function toggleGoalType(goalType: PlanningGoalType) {
    setPlanningDraft((currentDraft) => ({
      ...currentDraft,
      goalTypes: [goalType],
    }));
    setDraftMessage("");
    setPlanningStep("food");
  }

  function skipFoodContext() {
    setDraftMessage("");
    setPlanningStep("routine");
  }

  function handleFoodQuickReply(reply: string) {
    if (reply === "특별히 없어요") {
      skipFoodContext();
      return;
    }

    setDraftMessage(handleFoodQuickReplyText(reply));
  }

  function submitPlanningGuideAnswer() {
    const answer = draftMessage.trim();

    if (answer.length === 0) {
      return;
    }

    if (planningStep === "intent") {
      setPlanningDraft((currentDraft) => ({
        ...currentDraft,
        goalTypes: currentDraft.goalTypes.length > 0 ? currentDraft.goalTypes : ["other"],
        reasonText: answer,
      }));
      setDraftMessage("");
      setPlanningStep("food");
      return;
    }

    if (planningStep === "food") {
      setPlanningDraft((currentDraft) => ({
        ...currentDraft,
        foodsToKeepText: answer,
      }));
      setDraftMessage("");
      setPlanningStep("routine");
      return;
    }

    const nextDraft = {
      ...planningDraft,
      routineText: answer,
    };

    if (!isPlanningContextDraftReady(nextDraft)) {
      return;
    }

    setPlanningDraft(nextDraft);
    setDraftMessage("");
    setHasSubmittedPlanningContext(true);
    onSendMessage(summarizePlanningContext(createPlanningContextFromDraft(nextDraft)));
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
          <>
            <ChatBubble role="assistant">{getPlanningGuideQuestion(planningStep)}</ChatBubble>
            <View style={styles.contextDock}>
              <View style={styles.contextDockHeader}>
                <Text style={styles.contextDockKicker}>첫 플랜 준비</Text>
                <Text style={styles.contextDockStep}>
                  {getPlanningGuideStepLabel(planningStep)}
                </Text>
              </View>

              {getPlanningContextClues(planningDraft).length > 0 ? (
                <View style={styles.memoryStrip}>
                  {getPlanningContextClues(planningDraft).map((clue) => (
                    <View key={clue} style={styles.memoryChip}>
                      <Text style={styles.memoryChipText}>{clue}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {planningStep === "intent" ? (
                <View style={styles.quickReplyGrid}>
                  {planningGoalOptions.map((option) => (
                    <Pressable
                      accessibilityRole="button"
                      key={option.value}
                      onPress={() => toggleGoalType(option.value)}
                      style={styles.quickReplyChip}
                    >
                      <Text style={styles.quickReplyText}>{option.label}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}

              {planningStep === "food" ? (
                <View style={styles.quickReplyGrid}>
                  {["좋아하는 건 살리고 싶어요", "피해야 할 음식이 있어요", "특별히 없어요"].map(
                    (reply) => (
                      <Pressable
                        accessibilityRole="button"
                        key={reply}
                        onPress={() => handleFoodQuickReply(reply)}
                        style={styles.quickReplyChip}
                      >
                        <Text style={styles.quickReplyText}>{reply}</Text>
                      </Pressable>
                    ),
                  )}
                </View>
              ) : null}
            </View>
          </>
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
        inputDisabled={hasPendingConfirmation || isGeneratingResponse}
        maxAttachments={MAX_CHAT_ATTACHMENTS}
        onAddAttachment={pickAttachment}
        onChangeText={setDraftMessage}
        onRemoveAttachment={removeAttachment}
        onSubmit={submitMessage}
        placeholder={
          shouldShowPlanningGuide
            ? getPlanningGuidePlaceholder(planningStep)
            : hasPendingConfirmation
              ? "제안을 먼저 승인하거나 다시 제안받아 주세요."
              : isGeneratingResponse
                ? "플랜 제안을 만드는 중이에요..."
                : "편하게 이야기해 주세요..."
        }
        value={draftMessage}
      />
    </View>
  );
}

function handleFoodQuickReplyText(reply: string) {
  if (reply === "좋아하는 건 살리고 싶어요") {
    return "좋아하는 음식: ";
  }

  if (reply === "피해야 할 음식이 있어요") {
    return "피해야 할 음식: ";
  }

  return "";
}

function canSubmitPlanningGuideMessage(_step: PlanningContextGuideStep, message: string) {
  return message.trim().length > 0;
}

function getPlanningGuideQuestion(step: PlanningContextGuideStep) {
  if (step === "intent") {
    return "처음엔 방향만 잡을게요. 어떤 관리가 필요해서 오셨나요?";
  }

  if (step === "food") {
    return "좋아하는 음식, 계속 먹고 싶은 음식, 피해야 할 음식이 있으면 한 번에 편하게 적어주세요. 없으면 건너뛰어도 괜찮아요.";
  }

  return "좋아요. 이제 하루 흐름만 알려주세요. 기상, 식사, 퇴근 시간처럼 플랜을 끼워 넣을 단서가 필요해요.";
}

function getPlanningGuidePlaceholder(step: PlanningContextGuideStep) {
  if (step === "intent") {
    return "선택지에 없으면 직접 적어주세요";
  }

  if (step === "food") {
    return "예: 라면은 가끔 먹고 싶고, 크림소스는 피하고 싶어요";
  }

  return "예: 8시 기상, 11시 점심, 21시 퇴근";
}

function getPlanningGuideStepLabel(step: PlanningContextGuideStep) {
  if (step === "intent") {
    return "목적 · 필수";
  }

  if (step === "food") {
    return "음식 · 선택";
  }

  return "루틴 · 필수";
}

function getPlanningContextClues(draft: PlanningContextDraft) {
  const goals = draft.goalTypes
    .map((goalType) => planningGoalOptions.find((option) => option.value === goalType)?.label)
    .filter(Boolean);
  const clues = goals.map((goal) => `목적 ${goal}`);

  if (draft.foodsToKeepText.trim().length > 0) {
    clues.push("음식 취향 반영");
  }

  return clues;
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
  contextDock: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(254, 252, 248, 0.78)",
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    gap: theme.space.sm,
    maxWidth: 560,
    padding: theme.space.sm,
    width: "100%",
  },
  contextDockHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contextDockKicker: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
  },
  contextDockStep: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "800",
  },
  memoryStrip: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.space.xs,
  },
  memoryChip: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.small,
    paddingHorizontal: theme.space.xs,
    paddingVertical: 5,
  },
  memoryChipText: {
    color: theme.colors.primaryPressed,
    fontSize: 12,
    fontWeight: "800",
  },
  quickReplyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.space.xs,
  },
  quickReplyChip: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.borderStrong,
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 34,
    justifyContent: "center",
    paddingHorizontal: theme.space.sm,
  },
  quickReplyText: {
    color: theme.colors.inkSoft,
    fontSize: 13,
    fontWeight: "800",
  },
});
