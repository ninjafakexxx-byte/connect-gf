import { logger } from "./logger";

export function logMutationStart(name: string, correlationId: string) {
  logger.info("mutation", `${name}.start`, { correlationId });
}

export function logMutationSuccess(name: string, correlationId: string) {
  logger.info("mutation", `${name}.success`, { correlationId });
}

export function logMutationError(
  name: string,
  correlationId: string,
  error: unknown,
) {
  logger.error("mutation", `${name}.error`, {
    correlationId,
    error,
  });
}
