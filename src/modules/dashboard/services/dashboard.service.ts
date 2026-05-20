import { externalSupabase as supabase } from "@/integrations/external-supabase/client";

export async function getDashboardMetrics() {
  const [
    members,
    events,
    offers,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("events")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("offers")
      .select("amount"),
  ]);

  const totalOffers =
    offers.data?.reduce(
      (acc: number, item: any) =>
        acc + Number(item.amount || 0),
      0,
    ) || 0;

  return {
    totalMembers:
      members.count || 0,

    totalEvents:
      events.count || 0,

    totalOffers,
  };
}