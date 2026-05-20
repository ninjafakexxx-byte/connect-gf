export const themes = {
  dark: "theme-dark",
  black: "theme-black",
  light: "theme-light",
} as const;

export type ThemeName = keyof typeof themes;
