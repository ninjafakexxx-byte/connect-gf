import { executeMutationPipeline } from "@/shared/orchestration/create-mutation-pipeline";

export async function orchestrateEventMutation<T>(config: {
  action: "create" | "update" | "delete";
  entityId?: string;
  payload?: unknown;
  mutation: () => Promise<T>;
}) {
  return executeMutationPipeline({
    domain: "events",
    action: config.action,
    entityId: config.entityId,
    payload: config.payload,
    mutation: config.mutation,
  });
}
