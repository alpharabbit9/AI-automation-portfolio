export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
