import { useState } from "react";

export function useDashboardFilters() {
  const [period, setPeriod] =
    useState("30d");

  const [group, setGroup] =
    useState("all");

  return {
    period,
    setPeriod,
    group,
    setGroup,
  };
}