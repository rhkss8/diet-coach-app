import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
    backgroundColor: "#F8F7F4",
    flex: 1,
  },
  content: {
    gap: 24,
    padding: 24,
    paddingBottom: 36,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
  },
  eyebrow: {
    color: "#5E7664",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  closeButton: {
    borderColor: "#D7DED8",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  closeButtonLabel: {
    color: "#2F6B4F",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  header: {
    gap: 10,
  },
  title: {
    color: "#1F2A24",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 36,
  },
  description: {
    color: "#53645A",
    fontSize: 16,
    lineHeight: 24,
  },
  list: {
    gap: 12,
  },
  item: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DFE5E0",
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    padding: 16,
  },
  itemTitle: {
    color: "#1F2A24",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0,
  },
  itemDescription: {
    color: "#53645A",
    fontSize: 14,
    lineHeight: 20,
  },
});
