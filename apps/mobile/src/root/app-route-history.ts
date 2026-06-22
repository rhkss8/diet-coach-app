export type AppRoute = "adjustment" | "consultation" | "settings" | "today";

export const initialAppRouteHistory: AppRoute[] = ["consultation"];

/**
 * Adds a route to the in-app stack while avoiding duplicate pushes of the current screen.
 */
export function pushAppRoute(history: AppRoute[], route: AppRoute) {
  return history.at(-1) === route ? history : [...history, route];
}

/**
 * Removes one route from the in-app stack, keeping the consultation root intact.
 */
export function popAppRoute(history: AppRoute[]) {
  return canPopAppRoute(history) ? history.slice(0, -1) : history;
}

/**
 * Returns whether in-app back should pop a route instead of leaving the app session.
 */
export function canPopAppRoute(history: AppRoute[]) {
  return history.length > 1;
}
