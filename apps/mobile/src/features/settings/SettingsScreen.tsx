import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { commonStyles, theme } from "../../shared/ui/design-system";
import { getBasicSettingsItems, getReleaseLinks } from "./settings-items";

type SettingsScreenProps = {
  authMode: "authenticated" | "guest";
  onClose: () => void;
};

export function SettingsScreen({ authMode, onClose }: SettingsScreenProps) {
  const settingsItems = getBasicSettingsItems(getReleaseLinks());

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.eyebrow}>설정</Text>
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonLabel}>닫기</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>테스트 준비를 확인해요</Text>
        <Text style={styles.description}>
          현재는 {authMode === "guest" ? "게스트 모드" : "로그인 세션"}로 진행 중입니다.
        </Text>
      </View>

      <View style={styles.list}>
        {settingsItems.map((item) => (
          <Pressable
            accessibilityRole={item.url ? "link" : undefined}
            disabled={!item.url}
            key={item.id}
            onPress={() => {
              if (item.url) {
                void Linking.openURL(item.url);
              }
            }}
            style={styles.item}
          >
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    gap: theme.space.xl,
    padding: theme.space.xl,
    paddingBottom: 36,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eyebrow: {
    ...theme.type.eyebrow,
    color: theme.colors.primary,
  },
  closeButton: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 38,
    paddingHorizontal: theme.space.sm,
  },
  closeButtonLabel: {
    ...theme.type.button,
    color: theme.colors.primary,
  },
  header: {
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radius.large,
    gap: theme.space.sm,
    padding: theme.space.lg,
  },
  title: {
    ...theme.type.title,
    color: theme.colors.white,
  },
  description: {
    ...theme.type.body,
    color: "#D8E0DA",
  },
  list: {
    gap: theme.space.sm,
  },
  item: {
    ...commonStyles.card,
    gap: theme.space.xs,
    padding: theme.space.md,
  },
  itemTitle: {
    ...theme.type.body,
    color: theme.colors.ink,
    fontWeight: "900",
  },
  itemDescription: {
    ...theme.type.supporting,
    color: theme.colors.muted,
  },
});
