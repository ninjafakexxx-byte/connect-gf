export function runtimeHealthcheck() {
  return {
    timestamp: new Date().toISOString(),
    online: navigator.onLine,
    memory:
      "memory" in performance
        ? (performance as any).memory
        : null,
  };
}
