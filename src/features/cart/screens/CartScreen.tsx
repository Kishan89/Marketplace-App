import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CartItem as CartItemComponent } from '../components/CartItem';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Button } from '../../../shared/components/Button';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';
import { Spacing } from '../../../core/theme/spacing';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { selectCartItems, selectCartTotal, selectCartItemCount } from '../selectors';
import { formatCurrency } from '../../../shared/utils/formatCurrency';
import { CartStackParamList } from '../../../app/navigation/MainTabNavigator';

type Props = NativeStackScreenProps<CartStackParamList, 'CartList'>;

export const CartScreen: React.FC<Props> = ({ navigation }) => {
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectCartItemCount);

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.heading}>My Cart</Text>
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Add some products and they'll show up here"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.heading}>My Cart ({count} items)</Text>

      <FlashList
        data={items}
        keyExtractor={item => String(item.product.id)}
        renderItem={({ item }) => <CartItemComponent item={item} />}
        estimatedItemSize={100}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />

      {/* Summary footer */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
        <Button
          label="Proceed to Checkout"
          onPress={() => navigation.navigate('Checkout')}
          fullWidth
          style={styles.checkoutBtn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  heading: { ...Typography.h2, color: Colors.textPrimary, padding: Spacing.base, paddingBottom: Spacing.sm },
  list: { paddingVertical: Spacing.sm, paddingBottom: Spacing.lg },
  footer: {
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  totalLabel: { ...Typography.h4, color: Colors.textSecondary },
  totalValue: { ...Typography.h3, color: Colors.primary },
  checkoutBtn: {},
});
