export function notifySessionExpired() {
  window.dispatchEvent(
    new CustomEvent("adna:session-expired"),
  );
}

export function notifySessionRestored() {
  window.dispatchEvent(
    new CustomEvent("adna:session-restored"),
  );
}
