import { useCallback, useEffect, useState } from "react";

import { toast } from "sonner";

import { externalSupabase as supabase } from "@/integrations/external-supabase/client";

import type { Evento } from "../types/event.types";

export function useEvents() {
  const [events, setEvents] =
    useState<Evento[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadEvents = useCallback(
    async () => {
      setLoading(true);

      const { data, error } =
        await supabase
          .from("events")
          .select("*")
          .order("event_date", {
            ascending: true,
          });

      if (error) {
        console.error(error);

        toast.error(
          "Erro ao carregar eventos",
        );

        setLoading(false);

        return;
      }

      setEvents(
        (data as Evento[]) || [],
      );

      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    void loadEvents();

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
          void loadEvents();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadEvents]);

  return {
    events,
    loading,
    loadEvents,
  };
}