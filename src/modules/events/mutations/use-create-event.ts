import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/core/providers/query-provider";

import { queryKeys } from "@/core/query/query-keys";

import { createEvent } from "../services/events.service";

export function useCreateEvent() {
  return useMutation({
    mutationFn: createEvent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events,
      });
    },
  });
}