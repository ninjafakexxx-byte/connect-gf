export function trackFetch(
  endpoint: string,
  duration: number,
) {
  console.log("[FETCH METRIC]", {
    endpoint,
    duration,
  });
}
