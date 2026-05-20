import { themeAccess } from "./theme-role-access";

export function resolveThemeByRole(
  role: string,
  currentTheme: string,
) {
  const allowedThemes =
    themeAccess[role as keyof typeof themeAccess];

  if (!allowedThemes) {
    return "classic";
  }

  if (!allowedThemes.includes(currentTheme as never)) {
    return allowedThemes[0];
  }

  return currentTheme;
}
