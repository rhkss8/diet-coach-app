import type { ChatPlannerMessage, ChatPlannerResponse } from "@diet-coach/ai";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { PrimaryButton } from "../../shared/ui/PrimaryButton";

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
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>AI 상담</Text>
          <Text style={styles.title}>대화로 플랜을 만들어요</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onOpenPlan} style={styles.planButton}>
          <Text style={styles.planButtonText}>플랜</Text>
        </Pressable>
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
            <Text style={styles.confirmationTitle}>{pendingResponse.message}</Text>
            {"confirmation" in pendingResponse ? (
              <>
                <Text style={styles.confirmationDescription}>
                  {getResponsePreviewText(pendingResponse)}
                </Text>
                <PrimaryButton
                  label={pendingResponse.confirmation.label}
                  onPress={() => onApproveResponse(pendingResponse)}
                />
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
        <PrimaryButton disabled={!canSendMessage} label="전송" onPress={submitMessage} />
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

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F8F7F4",
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
    paddingBottom: 12,
  },
  eyebrow: {
    color: "#5E7664",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  title: {
    color: "#1F2A24",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 34,
  },
  planButton: {
    backgroundColor: "#E7EFE8",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  planButtonText: {
    color: "#2F5D46",
    fontSize: 14,
    fontWeight: "800",
  },
  messageList: {
    flex: 1,
  },
  messages: {
    gap: 12,
    padding: 24,
    paddingTop: 12,
  },
  messageBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    maxWidth: "86%",
    padding: 14,
  },
  userMessageBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#2F5D46",
  },
  messageText: {
    color: "#26342C",
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  confirmationCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#C9D7CC",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  confirmationTitle: {
    color: "#1F2A24",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 24,
  },
  confirmationDescription: {
    color: "#53645A",
    fontSize: 14,
    lineHeight: 20,
  },
  inputBar: {
    backgroundColor: "#F1EFE9",
    borderTopColor: "#E1DED5",
    borderTopWidth: 1,
    gap: 10,
    padding: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D9E0DA",
    borderRadius: 8,
    borderWidth: 1,
    color: "#1F2A24",
    fontSize: 15,
    minHeight: 70,
    padding: 12,
    textAlignVertical: "top",
  },
});
