import { TextStyle } from 'react-native';

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 34,
} as const;

export const FontWeight: Record<string, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
};

export const LineHeight = {
  tight: 18,
  normal: 22,
  relaxed: 26,
  loose: 32,
} as const;

export const Typography = {
  h1: { fontSize: FontSize.xxxl, fontWeight: FontWeight.bold, lineHeight: LineHeight.loose },
  h2: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, lineHeight: LineHeight.relaxed },
  h3: { fontSize: FontSize.xl, fontWeight: FontWeight.semiBold, lineHeight: LineHeight.relaxed },
  h4: { fontSize: FontSize.lg, fontWeight: FontWeight.semiBold, lineHeight: LineHeight.normal },
  body1: { fontSize: FontSize.base, fontWeight: FontWeight.regular, lineHeight: LineHeight.normal },
  body2: { fontSize: FontSize.sm, fontWeight: FontWeight.regular, lineHeight: LineHeight.normal },
  caption: { fontSize: FontSize.xs, fontWeight: FontWeight.regular, lineHeight: LineHeight.tight },
  button: { fontSize: FontSize.base, fontWeight: FontWeight.semiBold },
  price: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
} as const;
