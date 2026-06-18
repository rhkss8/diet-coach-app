import type { ChatPlannerMessage, ChatPlannerResponse } from "@diet-coach/ai";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { theme } from "../../shared/ui/design-system";
import {
  AppHeader,
  ChatBubble,
  HeaderAction,
  PlanProposalCard,
  PlannerChatInput,
} from "../../shared/ui/planner-components";

type ConsultationChatScreenProps = {
  messages: ChatPlannerMessage[];
  onApproveResponse: (response: ChatPlannerResponse) => void;
  onOpenPlan: () => void;
  onSendMessage: (message: string) => void;
  pendingResponse: ChatPlannerResponse | null;
};

/**
 * Maps the active consultation route to the Figma Make chat and chat-proposal source screens.
 */
export function ConsultationChatScreen({
  messages,
  onApproveResponse,
  onOpenPlan,
  onSendMessage,
  pendingResponse,
}: ConsultationChatScreenProps) {
  const [draftMessage, setDraftMessage] = useState("");
  const canSendMessage = draftMessage.trim().length > 0;

  function submitMessage() {
    const message = draftMessage.trim();

    if (!message) {
      return;
    }

    setDraftMessage("");
    onSendMessage(message);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <AppHeader
          actions={<HeaderAction label="오늘 플랜" onPress={onOpenPlan} />}
          kicker="TARS · AI 상담"
        />
      </View>

      <ScrollView contentContainerStyle={styles.messages} style={styles.messageList}>
        {messages.map((message) => (
          <ChatBubble key={message.id} role={message.role === "assistant" ? "assistant" : "user"}>
            {message.content}
          </ChatBubble>
        ))}

        {pendingResponse ? (
          "confirmation" in pendingResponse ? (
            <PlanProposalCard
              actionLabel={getConfirmationActionLabel(pendingResponse)}
              description={pendingResponse.message}
              items={getResponsePreviewItems(pendingResponse)}
              onApprove={() => onApproveResponse(pendingResponse)}
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
        disabled={!canSendMessage}
        onChangeText={setDraftMessage}
        onSubmit={submitMessage}
        placeholder="편하게 이야기해 주세요..."
        value={draftMessage}
      />
    </View>
  );
}

/**
 * Converts structured AI output into a short preview list that reads like a plan patch.
 */
function getResponsePreviewItems(
  response: Exclude<ChatPlannerResponse, { type: "clarification_question" }>,
) {
  if (response.type === "plan_revision_suggestion") {
    return [
      response.revision.summary,
      ...response.revision.updatedTodayItems.slice(0, 2).map((item) => {
        return `${getSlotLabel(item.slot)} · ${item.title}`;
      }),
    ];
  }

  return response.suggestedItems.slice(0, 3).map((item) => {
    return `${getSlotLabel(item.slot)} · ${item.title}`;
  });
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

function getSlotLabel(slot: string) {
  const labels: Record<string, string> = {
    breakfast: "아침",
    lunch: "점심",
    dinner: "저녁",
    snack: "간식",
    workout: "운동",
  };

  return labels[slot] ?? slot;
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
