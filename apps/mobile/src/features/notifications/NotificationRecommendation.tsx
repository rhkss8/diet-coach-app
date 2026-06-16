import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { useNotificationRecommendation } from "./useNotificationRecommendation";

export function NotificationRecommendation() {
  const {
    decideNotificationRecommendation,
    isHydratingNotificationDecision,
    shouldShowRecommendation,
  } = useNotificationRecommendation();

  if (isHydratingNotificationDecision || !shouldShowRecommendation) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        <Text style={styles.title}>저녁 복구 알림만 받아볼까요?</Text>
        <Text style={styles.description}>
          하루가 바뀌었을 때 다시 맞출 시간을 짧게 알려드릴게요.
        </Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton
          label="받아보기"
          onPress={() => {
            void decideNotificationRecommendation("accepted");
          }}
        />
        <PrimaryButton
          label="나중에"
          onPress={() => {
            void decideNotificationRecommendation("dismissed");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DCE4DD",
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
    padding: 16,
  },
  copy: {
    gap: 6,
  },
  title: {
    color: "#1F2A24",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 23,
  },
  description: {
    color: "#526056",
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
