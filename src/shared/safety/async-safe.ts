export async function asyncSafe<T>(
  fn: () => Promise<T>,
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    console.error("[ASYNC SAFE ERROR]", error);
    return null;
  }
}
