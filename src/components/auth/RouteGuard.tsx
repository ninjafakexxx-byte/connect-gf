import { useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';

const PUBLIC_ROUTES = ['/login', '/reset-password'];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;

    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (!user && !isPublic) {
      window.location.replace('/login');
    }
  }, [user, loading, pathname]);

  if (loading) {
    return null;
  }

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (!user && !isPublic) {
    return null;
  }

  return <>{children}</>;
}
