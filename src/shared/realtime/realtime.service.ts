import { logger } from "@/shared/logger/logger";

export type RealtimeEvent = {
  channel: string;
  event: string;
  payload?: unknown;
};

export async function broadcastRealtimeEvent(
  data: RealtimeEvent,
) {
  logger.info("realtime.broadcast", data);

  return Promise.resolve(data);
}
