import type {
  ChatPlannerAttachment,
  ChatPlannerMessage,
  ChatPlannerResponse,
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
  const hasPendingConfirmation = pendingResponse ? "confirmation" in pendingResponse : false;
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
});
