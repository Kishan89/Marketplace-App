export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
};

// Backward compatibility alias
export const Spacing = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  base: spacing.lg,
  lg: spacing.xl,
  xl: spacing.xxl,
  xxl: spacing.xxxl,
  xxxl: 48,
  huge: 64,
} as const;
