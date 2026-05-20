import { useEffect } from "react";

import { externalSupabase as supabase } from "@/integrations/external-supabase/client";

export function useEventsRealtime(
  onReload: () => void,
) {
  useEffect(() => {
    const channel = supabase
      .channel("events-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        () => {
          onReload();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onReload]);
}