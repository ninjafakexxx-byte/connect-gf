import { logger } from "@/shared/logger/logger";

export type AnalyticsEvent = {
  event: string;
  entity?: string;
  entityId?: string;
  payload?: unknown;
};

export async function trackAnalyticsEvent(data: AnalyticsEvent) {
  logger.info("analytics.event", data);

  return Promise.resolve(data);
}
