import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Product } from '../types';
import { useTheme } from '../../../core/theme/ThemeContext';
import { colors } from '../../../core/theme/colors';
import { typography } from '../../../core/theme/typography';
import { spacing, radius } from '../../../core/theme/spacing';
import { formatCurrency, calculateDiscountedPrice } from '../../../shared/utils/formatCurrency';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({ product, onPress }) => {
  const { colors } = useTheme();
  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => onPress(product)}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={`${product.title}, ${formatCurrency(discountedPrice)}`}
    >
      {/* Image */}
      <Image
        source={{ uri: product.thumbnail }}
        style={[styles.image, { backgroundColor: colors.skeletonBase }]}
        contentFit="cover"
        transition={200}
      />

      {/* Discount badge */}
      {hasDiscount ? (
        <View style={[styles.badge, { backgroundColor: colors.discount }]}>
          <Text style={[styles.badgeText, { color: colors.white }]}>-{Math.round(product.discountPercentage)}%</Text>
        </View>
      ) : null}

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.category, { color: colors.textTertiary }]}>{product.category}</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
          {product.title}
        </Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={[styles.rating, { color: colors.textSecondary }]}>{product.rating.toFixed(1)}</Text>
        </View>

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.primary }]}>{formatCurrency(discountedPrice)}</Text>
          {hasDiscount ? (
            <Text style={[styles.originalPrice, { color: colors.textTertiary }]}>{formatCurrency(product.price)}</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
});

ProductCard.displayName = 'ProductCard';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6, // Adjusted for exact equal spacing
    maxWidth: '48.5%', // Prevents the last item in an odd row from stretching
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: colors.skeletonBase,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.discount,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.caption.fontSize,
    color: colors.white,
  },
  info: { padding: spacing.sm },
  category: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.caption.fontSize,
    color: colors.textTertiary,
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  title: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    minHeight: 40,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  star: { fontSize: 11 },
  rating: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginLeft: 3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  price: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.price.fontSize,
    color: colors.primary,
  },
  originalPrice: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.caption.fontSize,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
});
