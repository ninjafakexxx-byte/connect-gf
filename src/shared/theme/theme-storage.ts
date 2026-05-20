const STORAGE_KEY = "adna-theme";

export function saveTheme(theme: string) {
  localStorage.setItem(STORAGE_KEY, theme);
}

export function loadTheme() {
  return localStorage.getItem(STORAGE_KEY);
}
