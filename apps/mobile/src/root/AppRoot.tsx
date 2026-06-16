import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../shared/ui/PrimaryButton";

export function AppRoot() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Diet Planner</Text>
        <Text style={styles.title}>계획이 바뀌어도 계속 이어갈 수 있게</Text>
        <Text style={styles.description}>
          온보딩, 7일 플랜, 오늘 조정하기 흐름을 이 화면에서부터 세로 슬라이스로 연결합니다.
        </Text>
        <PrimaryButton label="MVP 시작 준비됨" onPress={() => undefined} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F7F4",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: 18,
    paddingHorizontal: 24,
  },
  eyebrow: {
    color: "#5E7664",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
  },
  title: {
    color: "#1F2A24",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 38,
  },
  description: {
    color: "#53645A",
    fontSize: 16,
    lineHeight: 24,
  },
});
