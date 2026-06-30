export const typography = {
  fontFamily: {
    regular: 'Figtree_400Regular',
    medium: 'Figtree_500Medium',
    semibold: 'Figtree_600SemiBold',
    bold: 'Figtree_700Bold',
    extrabold: 'Figtree_800ExtraBold',
  },
  // Type scale
  display:   { fontSize: 32, lineHeight: 40, fontFamily: 'Figtree_800ExtraBold' },
  h1:        { fontSize: 26, lineHeight: 34, fontFamily: 'Figtree_700Bold' },
  h2:        { fontSize: 20, lineHeight: 28, fontFamily: 'Figtree_700Bold' },
  h3:        { fontSize: 17, lineHeight: 24, fontFamily: 'Figtree_600SemiBold' },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontFamily: 'Figtree_400Regular' },
  body:      { fontSize: 14, lineHeight: 20, fontFamily: 'Figtree_400Regular' },
  label:     { fontSize: 13, lineHeight: 18, fontFamily: 'Figtree_500Medium' },
  caption:   { fontSize: 12, lineHeight: 16, fontFamily: 'Figtree_400Regular' },
  price:     { fontSize: 18, lineHeight: 24, fontFamily: 'Figtree_700Bold' },
};

// Backward compatibility helper mapping old keys to new tokens
export const Typography = {
  h1: typography.h1,
  h2: typography.h2,
  h3: typography.h3,
  h4: typography.h3, // Map old h4 to h3
  body1: typography.bodyLarge,
  body2: typography.body,
  caption: typography.caption,
  price: typography.price,
  button: { fontSize: 16, fontFamily: 'Figtree_600SemiBold' },
} as const;
