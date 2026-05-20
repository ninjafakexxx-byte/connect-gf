import { useEffect } from "react";

/**
 * Registers the PWA service worker, but ONLY in safe environments:
 * - Never in iframes (Lovable editor preview runs the app in an iframe).
 * - Never on Lovable preview hosts.
 * - Only in production builds.
 */
export function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const inIframe = (() => {
      try {
        return window.self !== window.top;
      } catch {
        return true;
      }
    })();

    const host = window.location.hostname;
    const isPreviewHost =
      host.includes("id-preview--") ||
      host.includes("preview--") ||
      host.endsWith("lovableproject.com") ||
      host.endsWith("lovableproject-dev.com");

    if (inIframe || isPreviewHost || import.meta.env.DEV) {
      navigator.serviceWorker.getRegistrations?.().then((regs) => {
        regs.forEach((r) => r.unregister());
      });
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}
