export function trackTelemetry(event: string, payload?: unknown) {
  console.log("[TELEMETRY]", {
    event,
    payload,
    timestamp: Date.now(),
  });
}
