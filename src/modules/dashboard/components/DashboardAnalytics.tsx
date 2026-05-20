import { StatCard } from "@/shared/components/cards/StatCard";

import { useDashboardQuery } from "../queries/use-dashboard-query";

export function DashboardAnalytics() {
  const { data, isLoading } =
    useDashboardQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-[120px] rounded-2xl border" />
        <div className="h-[120px] rounded-2xl border" />
        <div className="h-[120px] rounded-2xl border" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Membros"
        value={String(
          data?.totalMembers || 0,
        )}
      />

      <StatCard
        title="Eventos"
        value={String(
          data?.totalEvents || 0,
        )}
      />

      <StatCard
        title="Ofertas"
        value={`R$ ${
          data?.totalOffers || 0
        }`}
      />
    </div>
  );
}