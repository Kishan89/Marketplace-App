import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { CartItem as CartItemType } from '../types';
import { useTheme } from '../../../core/theme/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { typography } from '../../../core/theme/typography';
import { spacing, radius } from '../../../core/theme/spacing';
import { formatCurrency, calculateDiscountedPrice } from '../../../shared/utils/formatCurrency';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { removeItem, updateQuantity } from '../slice/cartSlice';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = memo(({ item }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { product, quantity } = item;
  const unitPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
  const lineTotal = unitPrice * quantity;

  const handleRemove = () => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove "${product.title}" from the cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive', 
          onPress: () => dispatch(removeItem(product.id)) 
        }
      ]
    );
  };

  const handleDecrease = () => {
    if (quantity === 1) {
      handleRemove();
    } else {
      dispatch(updateQuantity({ productId: product.id, quantity: quantity - 1 }));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Image source={{ uri: product.thumbnail }} style={[styles.image, { backgroundColor: colors.skeletonBase }]} contentFit="cover" transition={200} />
      <View style={styles.details}>
        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.fontFamily.semibold }]} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={[styles.unitPrice, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
          {formatCurrency(unitPrice)} each
        </Text>
        <View style={styles.footer}>
          {/* Qty stepper */}
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[styles.stepBtn, { backgroundColor: colors.primaryLight }]}
              onPress={handleDecrease}
              accessibilityLabel="Decrease quantity"
            >
              <Text style={[styles.stepText, { color: colors.primary }]}>−</Text>
            </TouchableOpacity>
            <Text style={[styles.qty, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
              {quantity}
            </Text>
            <TouchableOpacity
              style={[styles.stepBtn, { backgroundColor: colors.primaryLight }]}
              onPress={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity + 1 }))}
              accessibilityLabel="Increase quantity"
            >
              <Text style={[styles.stepText, { color: colors.primary }]}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.lineTotal, { color: colors.primary, fontFamily: typography.fontFamily.bold }]}>
            {formatCurrency(lineTotal)}
          </Text>
        </View>
      </View>
      {/* Remove */}
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={handleRemove}
        accessibilityLabel={`Remove ${product.title} from cart`}
        accessibilityRole="button"
      >
        <Feather name="trash-2" size={18} color={colors.error} />
      </TouchableOpacity>
    </View>
  );
});

CartItem.displayName = 'CartItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  image: { width: 80, height: 80, borderRadius: radius.sm },
  details: { flex: 1, marginLeft: spacing.md },
  title: { fontSize: typography.body.fontSize, marginBottom: 4 },
  unitPrice: { fontSize: typography.caption.fontSize, marginBottom: spacing.sm },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepBtn: {
    width: 28, height: 28, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  stepText: { fontSize: 16, fontWeight: '700', lineHeight: 20 },
  qty: { fontSize: typography.body.fontSize, minWidth: 20, textAlign: 'center' },
  lineTotal: { fontSize: typography.bodyLarge.fontSize },
  removeBtn: { padding: spacing.xs, marginLeft: spacing.md },
  removeIcon: { fontSize: 18 },
});
