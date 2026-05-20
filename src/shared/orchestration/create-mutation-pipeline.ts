import { logAudit } from "@/lib/audit";

import { trackAnalyticsEvent } from "@/shared/analytics/analytics.service";
import { logger } from "@/shared/logger/logger";
import { broadcastRealtimeEvent } from "@/shared/realtime/realtime.service";

type MutationAction =
  | "create"
  | "update"
  | "delete";

type MutationPipelineConfig<T> = {
  domain: string;
  action: MutationAction;
  entityId?: string;
  payload?: unknown;
  entityName?: string;
  module?: string;
  mutation: () => Promise<T>;
};

export async function executeMutationPipeline<T>(
  config: MutationPipelineConfig<T>,
) {
  logger.info("mutation.pipeline.started", {
    domain: config.domain,
    action: config.action,
    entityId: config.entityId,
  });

  console.log("PIPELINE START", {
    domain: config.domain,
    action: config.action.toUpperCase(),
    entityId: config.entityId,
  });

  console.log("AUDIT PIPELINE", {
    domain: config.domain,
    action: config.action,
    entityId: config.entityId,
  });

  await logAudit(
    `${config.domain}.${config.action}.started`,
    config.domain,
    config.entityId,
    {
      payload: config.payload,
      entityName: config.entityName,
      module: config.module,
    },
  );

  const result = await config.mutation();

  await logAudit(
    `${config.domain}.${config.action}`,
    config.domain,
    config.entityId,
    {
      payload: config.payload,
      entityName: config.entityName,
      module: config.module,
    },
  );

  await trackAnalyticsEvent({
    event: `${config.domain}.${config.action}`,
    entity: config.domain,
    entityId: config.entityId,
    payload: config.payload,
  });

  await broadcastRealtimeEvent({
    channel: config.domain,
    event: `${config.domain}.${config.action}`,
    payload: {
      entityId: config.entityId,
    },
  });

  logger.info("mutation.pipeline.finished", {
    domain: config.domain,
    action: config.action,
    entityId: config.entityId,
  });

  return result;
}
