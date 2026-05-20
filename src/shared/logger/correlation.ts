export function createCorrelationId(prefix = "op") {
  return `${prefix}_${crypto.randomUUID()}`;
}
