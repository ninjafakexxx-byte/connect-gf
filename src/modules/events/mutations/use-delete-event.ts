import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/core/providers/query-provider";
import { queryKeys } from "@/core/query/query-keys";

import { orchestrateEventMutation } from "../orchestration/events.orchestration";
import { deleteEvent } from "../services/events.service";

export function useDeleteEvent() {
  return useMutation({
    mutationFn: async (id: string) => {
      console.log("[DELETE ORCHESTRATION]", { id });

      return orchestrateEventMutation({
        action: "delete",
        entityId: id,
        payload: { id },

        mutation: async () => {
          console.log("[DELETE AUDIT]", { id });

          return deleteEvent(id);
        },
      });
    },

    onSuccess: () => {
      console.log("[DELETE SUCCESS]");

      queryClient.invalidateQueries({
        queryKey: queryKeys.events,
      });
    },
  });
}
