import { Suspense } from "react";

interface LazyLoaderProps {
  children: React.ReactNode;
}

export function LazyLoader({
  children,
}: LazyLoaderProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="text-sm opacity-70">
            Carregando módulo...
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
