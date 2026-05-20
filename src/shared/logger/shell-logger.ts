export function logShellEvent(
  event: string,
  payload?: unknown,
) {
  console.log("[PRIVATE SHELL]", event, payload);
}
