export type SettingsItem = {
  description: string;
  id: "account" | "notifications" | "app_info";
  title: string;
};

export const basicSettingsItems = [
  {
    id: "account",
    title: "계정",
    description: "로그인 상태와 테스트 계정 정보를 확인합니다.",
  },
  {
    id: "notifications",
    title: "알림",
    description: "저녁 복구 알림 추천 상태를 확인합니다.",
  },
  {
    id: "app_info",
    title: "앱 정보",
    description: "MVP 테스트 버전과 지원 정보를 확인합니다.",
  },
] as const satisfies SettingsItem[];
