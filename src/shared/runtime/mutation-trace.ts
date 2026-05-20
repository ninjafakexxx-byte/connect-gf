import { createCorrelationId } from "../logger/correlation";
import { trackRuntimeEvent } from "./runtime-tracker";

export async function traceMutation<T>(
  operation: string,
  payload: unknown,
  fn: () => Promise<T>,
) {
  const id = createCorrelationId("mutation");
  const start = performance.now();

  trackRuntimeEvent({
    id,
    operation,
    payload,
    status: "start",
    timestamp: Date.now(),
  });

  try {
    const result = await fn();

    trackRuntimeEvent({
      id,
      operation,
      status: "success",
      timestamp: Date.now(),
      duration: performance.now() - start,
    });

    return result;
  } catch (error) {
    trackRuntimeEvent({
      id,
      operation,
      status: "error",
      timestamp: Date.now(),
      duration: performance.now() - start,
      error,
    });

    throw error;
  }
}
