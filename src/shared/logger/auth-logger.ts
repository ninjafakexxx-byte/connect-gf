import { logger } from "./logger";

export function logAuthEvent(
  event: string,
  payload?: unknown,
) {
  logger.info("auth", event, payload as Record<string, unknown>);
}
