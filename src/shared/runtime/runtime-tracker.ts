export type RuntimeEventStatus =
  | "start"
  | "success"
  | "error";

export interface RuntimeEvent {
  id: string;
  operation: string;
  status: RuntimeEventStatus;
  timestamp: number;
  duration?: number;
  payload?: unknown;
  error?: unknown;
}

const runtimeStore: RuntimeEvent[] = [];

export function trackRuntimeEvent(event: RuntimeEvent) {
  runtimeStore.unshift(event);

  if (runtimeStore.length > 100) {
    runtimeStore.pop();
  }

  console.log("[RUNTIME EVENT]", event);
}

export function getRuntimeEvents() {
  return runtimeStore;
}
