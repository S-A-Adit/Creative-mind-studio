/**
 * motion-constants.ts — shared animation easing values.
 * Separate from MotionPrimitives.tsx to satisfy react-refresh/only-export-components.
 */

export const ease = {
  snappy: [0.22, 1, 0.36, 1] as [number, number, number, number],
  gentle: [0.4, 0, 0.2, 1]  as [number, number, number, number],
} as const;
