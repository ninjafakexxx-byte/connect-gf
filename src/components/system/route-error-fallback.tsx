export function RouteErrorFallback() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="space-y-3 text-center">
        <h2 className="text-lg font-semibold">
          Falha ao carregar módulo
        </h2>

        <button
          className="rounded bg-black px-4 py-2 text-white"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
