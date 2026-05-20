export function KPIOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border p-5">
        <p className="text-sm text-muted-foreground">
          Crescimento mensal
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          +18%
        </h3>
      </div>

      <div className="rounded-2xl border p-5">
        <p className="text-sm text-muted-foreground">
          Retenção
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          92%
        </h3>
      </div>

      <div className="rounded-2xl border p-5">
        <p className="text-sm text-muted-foreground">
          Engajamento
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          Alto
        </h3>
      </div>
    </div>
  );
}