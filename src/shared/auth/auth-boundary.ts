export function shouldRenderPrivateShell(
  authenticated?: boolean,
  loading?: boolean,
) {
  if (loading) return false;

  return !!authenticated;
}
