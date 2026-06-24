export type AuthGateState = "authenticated" | "guest" | "requires_auth";
export type SocialAuthProvider = "google" | "kakao";

export const authRedirectUrl = "dietcoach://auth/callback";

export function isValidAuthEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function getSocialAuthProviderLabel(provider: SocialAuthProvider) {
  return provider === "kakao" ? "카카오" : "구글";
}

export function parseAuthCallbackUrl(value: string):
  | {
      type: "code";
      code: string;
    }
  | {
      type: "tokens";
      accessToken: string;
      refreshToken: string;
    }
  | null {
  const params = getCallbackParams(value);
  const code = params.get("code");

  if (code) {
    return {
      code,
      type: "code",
    };
  }

  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (accessToken && refreshToken) {
    return {
      accessToken,
      refreshToken,
      type: "tokens",
    };
  }

  return null;
}

function getCallbackParams(value: string) {
  const url = new URL(value);
  const params = new URLSearchParams(url.search);
  const hash = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
  const hashParams = new URLSearchParams(hash);

  hashParams.forEach((paramValue, key) => {
    params.set(key, paramValue);
  });

  return params;
}

export function getAuthGateState({
  hasSession,
  isGuest,
}: {
  hasSession: boolean;
  isGuest: boolean;
}): AuthGateState {
  if (hasSession) {
    return "authenticated";
  }

  if (isGuest) {
    return "guest";
  }

  return "requires_auth";
}
