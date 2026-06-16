export type AuthGateState = "authenticated" | "guest" | "requires_auth";

export function isValidAuthEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
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
