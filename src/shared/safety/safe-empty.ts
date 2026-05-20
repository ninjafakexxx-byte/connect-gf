export function ensureArray<T>(
  value?: T[] | null,
): T[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value;
}
