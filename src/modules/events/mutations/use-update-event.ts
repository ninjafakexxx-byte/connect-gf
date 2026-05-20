import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/core/providers/query-provider";

import { queryKeys } from "@/core/query/query-keys";

import { updateEvent } from "../services/events.service";

export function useUpdateEvent() {
  return useMutation({
    mutationFn: updateEvent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events,
      });
    },
  });
}