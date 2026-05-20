import React from "react";

interface State {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<
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
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="rounded-2xl border p-6 text-center">
            <h2 className="text-lg font-semibold">
              Algo deu errado
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              O módulo encontrou um erro inesperado.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
