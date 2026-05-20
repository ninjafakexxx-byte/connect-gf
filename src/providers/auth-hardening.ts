export interface AuthLifecycleState {
  initialized: boolean;
  authenticated: boolean;
}

export const defaultAuthLifecycleState: AuthLifecycleState = {
  initialized: false,
  authenticated: false,
};

export function clearAuthState() {
  localStorage.removeItem("supabase.auth.token");

  sessionStorage.clear();

  window.dispatchEvent(
    new CustomEvent("adna:auth-cleared"),
  );
}

export function redirectToLogin() {
  window.location.href = "/login";
}
