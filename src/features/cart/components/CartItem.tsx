import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { CartItem as CartItemType } from '../types';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';
import { Spacing } from '../../../core/theme/spacing';
import { formatCurrency, calculateDiscountedPrice } from '../../../shared/utils/formatCurrency';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { removeItem, updateQuantity } from '../slice/cartSlice';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = memo(({ item }) => {
  const dispatch = useAppDispatch();
  const { product, quantity } = item;
  const unitPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
  const lineTotal = unitPrice * quantity;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.thumbnail }} style={styles.image} contentFit="cover" transition={200} />
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        <Text style={styles.unitPrice}>{formatCurrency(unitPrice)} each</Text>
        <View style={styles.footer}>
          {/* Qty stepper */}
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity - 1 }))}
              accessibilityLabel="Decrease quantity"
            >
              <Text style={styles.stepText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{quantity}</Text>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity + 1 }))}
              accessibilityLabel="Increase quantity"
            >
              <Text style={styles.stepText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.lineTotal}>{formatCurrency(lineTotal)}</Text>
        </View>
      </View>
      {/* Remove */}
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => dispatch(removeItem(product.id))}
        accessibilityLabel={`Remove ${product.title} from cart`}
        accessibilityRole="button"
      >
        <Text style={styles.removeIcon}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
});

CartItem.displayName = 'CartItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.sm,
    marginHorizontal: Spacing.base,
    marginVertical: 6,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'flex-start',
  },
  image: { width: 80, height: 80, borderRadius: 12, backgroundColor: Colors.skeletonBase },
  details: { flex: 1, marginLeft: Spacing.sm },
  title: { ...Typography.body2, color: Colors.textPrimary, fontWeight: '600', marginBottom: 4 },
  unitPrice: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.sm },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  stepBtn: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  stepText: { fontSize: 16, color: Colors.primaryDark, fontWeight: '700', lineHeight: 20 },
  qty: { ...Typography.body1, color: Colors.textPrimary, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  lineTotal: { ...Typography.body1, color: Colors.primary, fontWeight: '700' },
  removeBtn: { padding: Spacing.xs, marginLeft: Spacing.sm },
  removeIcon: { fontSize: 18 },
});
