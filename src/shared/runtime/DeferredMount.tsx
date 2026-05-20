import { PropsWithChildren, useEffect, useRef, useState } from 'react';

interface DeferredMountProps extends PropsWithChildren {
  minHeight?: number;
  delay?: number;
}

export function DeferredMount({ children, minHeight = 220, delay = 120 }: DeferredMountProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = window.setTimeout(() => {
            setVisible(true);
          }, delay);

          observer.disconnect();
          return () => window.clearTimeout(timer);
        }
      },
      {
        rootMargin: '120px',
        threshold: 0.05,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} style={{ minHeight }}>
      {visible ? children : null}
    </div>
  );
}
