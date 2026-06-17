import type { ChatPlannerMessage, ChatPlannerResponse } from "@diet-coach/ai";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { commonStyles, theme } from "../../shared/ui/design-system";

type ConsultationChatScreenProps = {
  messages: ChatPlannerMessage[];
  onApproveResponse: (response: ChatPlannerResponse) => void;
  onOpenPlan: () => void;
  onSendMessage: (message: string) => void;
  pendingResponse: ChatPlannerResponse | null;
};

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
      <View style={styles.headerShell}>
        <View style={styles.headerTop}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>T</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={onOpenPlan} style={styles.planButton}>
            <Text style={styles.planButtonText}>오늘 플랜</Text>
          </Pressable>
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>ADAPTIVE PLANNER</Text>
          <Text style={styles.title}>상담하고, 제안만 골라 담아요</Text>
          <Text style={styles.description}>
            AI가 플랜을 바로 바꾸지 않아요. 식단, 운동, 수정안은 먼저 카드로 보여드리고 승인한 것만
            반영합니다.
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.messages} style={styles.messageList}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.messageBubble, message.role === "user" && styles.userMessageBubble]}
          >
            <Text style={[styles.messageText, message.role === "user" && styles.userMessageText]}>
              {message.content}
            </Text>
          </View>
        ))}

        {pendingResponse ? (
          <View style={styles.confirmationCard}>
            <View style={styles.confirmationHeader}>
              <Text style={styles.confirmationKicker}>{getResponseTypeLabel(pendingResponse)}</Text>
              <Text style={styles.confirmationTitle}>{pendingResponse.message}</Text>
            </View>
            {"confirmation" in pendingResponse ? (
              <>
                <Text style={styles.confirmationDescription}>
                  {getResponsePreviewText(pendingResponse)}
                </Text>
                <View style={styles.confirmationActions}>
                  <PrimaryButton
                    label={pendingResponse.confirmation.label}
                    onPress={() => onApproveResponse(pendingResponse)}
                  />
                </View>
              </>
            ) : (
              <Text style={styles.confirmationDescription}>{pendingResponse.question}</Text>
            )}
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          multiline
          onChangeText={setDraftMessage}
          placeholder="예: 회식이 잦아서 저녁 식단을 현실적으로 맞추고 싶어요"
          placeholderTextColor="#8A968E"
          style={styles.input}
          value={draftMessage}
        />
        <PrimaryButton disabled={!canSendMessage} label="제안 받기" onPress={submitMessage} />
      </View>
    </View>
  );
}

function getResponsePreviewText(
  response: Exclude<ChatPlannerResponse, { type: "clarification_question" }>,
) {
  if (response.type === "plan_revision_suggestion") {
    return response.revision.summary;
  }

  return response.suggestedItems.map((item) => item.title).join(", ");
}

function getResponseTypeLabel(response: ChatPlannerResponse) {
  if (response.type === "meal_plan_suggestion") {
    return "식단 제안";
  }

  if (response.type === "exercise_plan_suggestion") {
    return "운동 제안";
  }

  if (response.type === "plan_revision_suggestion") {
    return "수정 제안";
  }

  return "추가 질문";
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  headerShell: {
    backgroundColor: theme.colors.ink,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: theme.space.xl,
    padding: theme.space.xl,
    paddingBottom: theme.space.xxl,
  },
  headerTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: theme.colors.warmSoft,
    borderRadius: theme.radius.medium,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  brandMarkText: {
    color: theme.colors.warm,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0,
  },
  headerCopy: {
    gap: theme.space.sm,
  },
  eyebrow: {
    ...theme.type.eyebrow,
    color: "#B8CFC2",
  },
  title: {
    ...theme.type.title,
    color: theme.colors.white,
    maxWidth: 360,
  },
  description: {
    ...theme.type.body,
    color: "#D8E0DA",
    maxWidth: 440,
  },
  planButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.22)",
    borderRadius: theme.radius.small,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: theme.space.md,
  },
  planButtonText: {
    ...theme.type.button,
    color: theme.colors.white,
  },
  messageList: {
    flex: 1,
  },
  messages: {
    gap: theme.space.md,
    padding: theme.space.xl,
  },
  messageBubble: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.large,
    borderTopLeftRadius: theme.radius.small,
    borderWidth: 1,
    maxWidth: "86%",
    padding: theme.space.md,
  },
  userMessageBubble: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderTopLeftRadius: theme.radius.large,
    borderTopRightRadius: theme.radius.small,
  },
  messageText: {
    ...theme.type.supporting,
    color: theme.colors.inkSoft,
  },
  userMessageText: {
    color: theme.colors.white,
  },
  confirmationCard: {
    ...commonStyles.card,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    gap: theme.space.md,
    padding: theme.space.lg,
  },
  confirmationHeader: {
    borderLeftColor: theme.colors.warm,
    borderLeftWidth: 4,
    gap: theme.space.xs,
    paddingLeft: theme.space.md,
  },
  confirmationKicker: {
    ...theme.type.eyebrow,
    color: theme.colors.warm,
  },
  confirmationTitle: {
    ...theme.type.sectionTitle,
    color: theme.colors.ink,
  },
  confirmationDescription: {
    ...theme.type.supporting,
    color: theme.colors.muted,
  },
  confirmationActions: {
    alignItems: "flex-start",
  },
  inputBar: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    gap: theme.space.sm,
    padding: theme.space.md,
  },
  input: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    color: theme.colors.ink,
    fontSize: 15,
    minHeight: 74,
    padding: theme.space.md,
    textAlignVertical: "top",
  },
});
