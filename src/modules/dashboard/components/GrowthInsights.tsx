import { useGrowthMetrics } from "../analytics/use-growth-metrics";

export function GrowthInsights() {
  const metrics =
    useGrowthMetrics();

  return (
    <div className="rounded-2xl border p-5">
      <h2 className="text-lg font-semibold">
        Growth Insights
      </h2>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Crescimento
          </p>

          <h3 className="text-2xl font-bold">
            {metrics.monthlyGrowth}%
          </h3>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Retenção
          </p>

          <h3 className="text-2xl font-bold">
            {metrics.retentionRate}%
          </h3>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Usuários ativos
          </p>

          <h3 className="text-2xl font-bold">
            {metrics.activeUsers}
          </h3>
        </div>
      </div>
    </div>
  );
}