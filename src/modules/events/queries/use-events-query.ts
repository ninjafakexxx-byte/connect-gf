import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/query/query-keys";

import { getEvents } from "../services/events.service";

export function useEventsQuery() {
  return useQuery({
    queryKey: queryKeys.events,
    queryFn: getEvents,
  });
}
