export function isLowEndDevice() {
  const memory = (navigator as any).deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;

  const isMobile =
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  return isMobile && (memory <= 4 || cores <= 4);
}
