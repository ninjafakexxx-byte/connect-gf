import { ReactNode, useEffect, useState } from 'react';

interface DeferredRenderProps {
  children: ReactNode;
  delay?: number;
  fallback?: ReactNode;
}

export function DeferredRender({ children, delay = 120, fallback = null }: DeferredRenderProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const activate = () => {
      if (!cancelled) {
        setVisible(true);
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = (window as any).requestIdleCallback(activate, { timeout: delay + 100 });

      return () => {
        cancelled = true;
        if ('cancelIdleCallback' in window) {
          (window as any).cancelIdleCallback(idleId);
        }
      };
    }

    const timeout = setTimeout(activate, delay);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [delay]);

  return visible ? <>{children}</> : <>{fallback}</>;
}
