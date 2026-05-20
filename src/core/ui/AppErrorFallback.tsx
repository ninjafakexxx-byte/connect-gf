type AppErrorFallbackProps = {
  title?: string;
  description?: string;
};

export function AppErrorFallback({
  title = "Algo deu errado",
  description = "Ocorreu um erro inesperado.",
}: AppErrorFallbackProps) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="max-w-md rounded-2xl border bg-card p-6 text-center shadow-sm">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
