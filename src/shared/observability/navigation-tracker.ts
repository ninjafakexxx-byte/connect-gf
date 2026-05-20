export function trackNavigation(
  route: string,
) {
  console.log("[NAVIGATION]", {
    route,
    at: new Date().toISOString(),
  });
}
