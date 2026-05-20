import { useDashboardAnalytics } from "../analytics/hooks/use-dashboard-analytics";

export function RealtimeInsights() {
  const { data } =
    useDashboardAnalytics();

  return (
    <div className="rounded-2xl border p-5">
      <h2 className="mb-4 text-lg font-semibold">
        Insights em tempo real
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">
            Eventos totais
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {data?.totalEvents ?? "--"}
          </h3>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">
            Ofertas totais
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            R$ {data?.totalOffers ?? "--"}
          </h3>
        </div>
      </div>
    </div>
  );
}