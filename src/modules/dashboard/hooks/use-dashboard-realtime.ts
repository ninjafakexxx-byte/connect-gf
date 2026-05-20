import { useEffect } from "react";

import { externalSupabase as supabase } from "@/integrations/external-supabase/client";

export function useDashboardRealtime(
  reload: () => void,
) {
  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        reload,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reload]);
}