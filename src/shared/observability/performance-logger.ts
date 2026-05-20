export function measureRuntime(
  label: string,
  start: number,
) {
  const duration = performance.now() - start;

  console.log(
    `[PERF] ${label} took ${duration.toFixed(2)}ms`,
  );

  return duration;
}
