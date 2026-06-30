// Core color palette for Mini Marketplace
export const Colors = {
  // Brand
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  primaryDark: '#4834D4',

  // Accent
  accent: '#00CEC9',
  accentLight: '#81ECEC',

  // Success / Error / Warning
  success: '#00B894',
  error: '#D63031',
  warning: '#FDCB6E',
  info: '#0984E3',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  background: '#F7F8FC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#636E72',
  textDisabled: '#B2BEC3',
  textInverse: '#FFFFFF',

  // Border
  border: '#DFE6E9',
  borderFocused: '#6C5CE7',

  // Skeleton / Shimmer
  skeletonBase: '#E8ECF4',
  skeletonHighlight: '#F5F7FA',

  // Overlay
  overlay: 'rgba(0,0,0,0.5)',

  // Tab bar
  tabActive: '#6C5CE7',
  tabInactive: '#B2BEC3',
  tabBackground: '#FFFFFF',

  // Cart badge
  badge: '#D63031',
} as const;

export type ColorKey = keyof typeof Colors;
