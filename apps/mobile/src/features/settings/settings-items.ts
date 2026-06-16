export type SettingsItem = {
  description: string;
  id: "account" | "notifications" | "privacy_policy" | "terms" | "feedback" | "app_info";
  title: string;
  url?: string;
};

export type ReleaseLinks = {
  feedbackUrl?: string;
  privacyPolicyUrl?: string;
  termsUrl?: string;
};

export function getBasicSettingsItems(releaseLinks: ReleaseLinks = {}): SettingsItem[] {
  return [
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
      id: "privacy_policy",
      title: "개인정보 처리방침",
      description: releaseLinks.privacyPolicyUrl
        ? "개인정보 수집과 사용 기준을 확인합니다."
        : "링크 URL을 설정하면 확인할 수 있습니다.",
      url: releaseLinks.privacyPolicyUrl,
    },
    {
      id: "terms",
      title: "이용약관",
      description: releaseLinks.termsUrl
        ? "MVP 테스트 이용 기준을 확인합니다."
        : "링크 URL을 설정하면 확인할 수 있습니다.",
      url: releaseLinks.termsUrl,
    },
    {
      id: "feedback",
      title: "피드백 보내기",
      description: releaseLinks.feedbackUrl
        ? "테스트 중 불편했던 점을 바로 보냅니다."
        : "피드백 채널 URL을 설정하면 사용할 수 있습니다.",
      url: releaseLinks.feedbackUrl,
    },
    {
      id: "app_info",
      title: "앱 정보",
      description: "MVP 테스트 버전과 지원 정보를 확인합니다.",
    },
  ];
}

export const basicSettingsItems = getBasicSettingsItems();

export function getReleaseLinks(env: Record<string, string | undefined> = getRuntimeEnv()) {
  return {
    feedbackUrl: env.EXPO_PUBLIC_FEEDBACK_URL || undefined,
    privacyPolicyUrl: env.EXPO_PUBLIC_PRIVACY_POLICY_URL || undefined,
    termsUrl: env.EXPO_PUBLIC_TERMS_URL || undefined,
  } satisfies ReleaseLinks;
}

function getRuntimeEnv(): Record<string, string | undefined> {
  return globalThisWithProcess.process?.env ?? {};
}

const globalThisWithProcess = globalThis as typeof globalThis & {
  process?: {
    env?: Record<string, string | undefined>;
  };
};
