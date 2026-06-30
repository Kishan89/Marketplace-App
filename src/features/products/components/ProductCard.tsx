import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Product } from '../types';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';
import { Spacing } from '../../../core/theme/spacing';
import { formatCurrency, calculateDiscountedPrice } from '../../../shared/utils/formatCurrency';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({ product, onPress }) => {
  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(product)}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={`${product.title}, ${formatCurrency(discountedPrice)}`}
    >
      {/* Image */}
      <Image
        source={{ uri: product.thumbnail }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />

      {/* Discount badge */}
      {hasDiscount ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>-{Math.round(product.discountPercentage)}%</Text>
        </View>
      ) : null}

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
        </View>

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatCurrency(discountedPrice)}</Text>
          {hasDiscount ? (
            <Text style={styles.originalPrice}>{formatCurrency(product.price)}</Text>
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
    margin: 6,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.skeletonBase,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.error,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
  },
  info: { padding: Spacing.sm },
  category: {
    ...Typography.caption,
    color: Colors.textDisabled,
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  title: {
    ...Typography.body2,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    minHeight: 34,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  star: { fontSize: 11 },
  rating: { ...Typography.caption, color: Colors.textSecondary, marginLeft: 3 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  price: { ...Typography.price, color: Colors.primary },
  originalPrice: {
    ...Typography.caption,
    color: Colors.textDisabled,
    textDecorationLine: 'line-through',
  },
});
