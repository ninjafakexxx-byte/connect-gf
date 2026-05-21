export const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export const reduceMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
