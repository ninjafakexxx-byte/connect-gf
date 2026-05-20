import { useEffect } from "react";

export function useDashboardRealtime() {
  useEffect(() => {
    console.log(
      "[dashboard] realtime connected",
    );

    return () => {
      console.log(
        "[dashboard] realtime disconnected",
      );
    };
  }, []);
}