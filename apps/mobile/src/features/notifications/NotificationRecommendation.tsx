import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { theme } from "../../shared/ui/design-system";
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
          variant="ghost"
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
    backgroundColor: theme.colors.secondarySoft,
    borderColor: "#C8D4E4",
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    gap: theme.space.md,
    padding: theme.space.md,
  },
  copy: {
    gap: theme.space.xs,
  },
  title: {
    ...theme.type.sectionTitle,
    color: theme.colors.ink,
  },
  description: {
    ...theme.type.supporting,
    color: theme.colors.muted,
  },
  actions: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.space.xs,
  },
});
