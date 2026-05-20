import { useEffect, useState } from "react";
import { getDashboardAnalytics } from "../services/dashboard-analytics-service";

export function useDashboardAnalytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const analytics =
        await getDashboardAnalytics();

      setData(analytics);
    }

    void load();
  }, []);

  return {
    data,
  };
}