import type { ChatPlannerMessage, ChatPlannerResponse } from "@diet-coach/ai";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { theme } from "../../shared/ui/design-system";

type ConsultationChatScreenProps = {
  messages: ChatPlannerMessage[];
  onApproveResponse: (response: ChatPlannerResponse) => void;
  onOpenPlan: () => void;
  onSendMessage: (message: string) => void;
  pendingResponse: ChatPlannerResponse | null;
};

/**
 * Coordinates the chat-first planning workspace where AI answers become explicit plan actions.
 *
 * Draft text stays local to the screen, while approved AI suggestions are delegated to the caller so
 * plan mutation remains reviewable and reversible.
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
          <Text style={styles.eyebrow}>RECOVERY PLANNER</Text>
          <Text style={styles.title}>상담은 가볍게, 변경은 승인 후에</Text>
          <Text style={styles.description}>
            식단, 운동, 수정안은 먼저 플랜 패치 카드로 정리됩니다. 현재 계획은 사용자가 승인하기
            전까지 그대로 유지돼요.
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
              <View style={styles.confirmationHeaderTop}>
                <Text style={styles.confirmationKicker}>
                  {getResponseTypeLabel(pendingResponse)}
                </Text>
                {"confirmation" in pendingResponse ? (
                  <Text style={styles.pendingBadge}>승인 전</Text>
                ) : null}
              </View>
              <Text style={styles.confirmationTitle}>{pendingResponse.message}</Text>
            </View>
            {"confirmation" in pendingResponse ? (
              <>
                <View style={styles.patchBody}>
                  {getResponsePreviewItems(pendingResponse).map((previewItem, index) => (
                    <View key={`${previewItem}-${index}`} style={styles.patchItem}>
                      <View style={styles.patchDot} />
                      <Text style={styles.patchItemText}>{previewItem}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.confirmationFootnote}>
                  승인 전까지 오늘 플랜은 바뀌지 않아요.
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

/**
 * Converts structured AI output into a short preview list that reads like a plan patch.
 */
function getResponsePreviewItems(
  response: Exclude<ChatPlannerResponse, { type: "clarification_question" }>,
) {
  if (response.type === "plan_revision_suggestion") {
    const changedCount = response.revision.changedItemIds.length;

    return [
      response.revision.summary,
      `오늘 항목 ${changedCount}개를 다시 맞춰요`,
      ...response.revision.updatedTodayItems.slice(0, 2).map((item) => {
        return `${getSlotLabel(item.slot)} · ${item.title}`;
      }),
    ];
  }

  return response.suggestedItems.slice(0, 3).map((item) => {
    return `${getSlotLabel(item.slot)} · ${item.title}`;
  });
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
    backgroundColor: theme.colors.surface,
    borderColor: "#D9B8A8",
    borderRadius: theme.radius.large,
    borderWidth: 1,
    gap: theme.space.md,
    padding: theme.space.lg,
  },
  confirmationHeader: {
    gap: theme.space.xs,
  },
  confirmationHeaderTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confirmationKicker: {
    ...theme.type.eyebrow,
    color: theme.colors.warm,
  },
  pendingBadge: {
    ...theme.type.caption,
    backgroundColor: theme.colors.warmSoft,
    borderColor: "#E3C7B8",
    borderRadius: theme.radius.small,
    borderWidth: 1,
    color: theme.colors.warm,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: theme.space.xs,
    paddingVertical: theme.space.xxs,
  },
  confirmationTitle: {
    ...theme.type.sectionTitle,
    color: theme.colors.ink,
  },
  confirmationDescription: {
    ...theme.type.supporting,
    color: theme.colors.muted,
  },
  patchBody: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    gap: theme.space.sm,
    padding: theme.space.md,
  },
  patchItem: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: theme.space.xs,
  },
  patchDot: {
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    height: 8,
    marginTop: 7,
    width: 8,
  },
  patchItemText: {
    ...theme.type.supporting,
    color: theme.colors.inkSoft,
    flex: 1,
    fontWeight: "700",
  },
  confirmationFootnote: {
    ...theme.type.caption,
    color: theme.colors.subtle,
    fontWeight: "800",
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
