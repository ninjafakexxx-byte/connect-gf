import { Navigate } from "@tanstack/react-router";
import { ReactNode } from "react";

interface PrivateShellGuardProps {
  authenticated?: boolean;
  loading?: boolean;
  children: ReactNode;
}

export function PrivateShellGuard({
  authenticated,
  loading,
  children,
}: PrivateShellGuardProps) {
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm opacity-70">
          Inicializando sessão...
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
