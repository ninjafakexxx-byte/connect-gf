import React from "react";

interface State {
  hasError: boolean;
}

export class GlobalErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error) {
    console.error("[GLOBAL ERROR]", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="space-y-3 text-center">
            <h1 className="text-xl font-semibold">
              Falha inesperada
            </h1>

            <button
              className="rounded bg-black px-4 py-2 text-white"
              onClick={() => window.location.reload()}
            >
              Recarregar aplicação
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
