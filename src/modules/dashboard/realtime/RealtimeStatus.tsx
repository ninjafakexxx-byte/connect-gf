export function RealtimeStatus() {
  return (
    <div className="rounded-2xl border p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Realtime Status
          </h2>

          <p className="text-sm text-muted-foreground">
            Sistema sincronizado em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500" />

          <span className="text-sm font-medium">
            Online
          </span>
        </div>
      </div>
    </div>
  );
}