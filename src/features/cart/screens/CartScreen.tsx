import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CartItem as CartItemComponent } from '../components/CartItem';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Button } from '../../../shared/components/Button';
import { Image } from 'expo-image';
import { useTheme } from '../../../core/theme/ThemeContext';
import { typography } from '../../../core/theme/typography';
import { spacing, radius } from '../../../core/theme/spacing';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { selectCartItems, selectCartTotal, selectCartItemCount } from '../selectors';
import { formatCurrency } from '../../../shared/utils/formatCurrency';
import { CartStackParamList } from '../../../app/navigation/MainTabNavigator';

type Props = NativeStackScreenProps<CartStackParamList, 'CartList'>;

const TypedFlashList = FlashList as any;

export const CartScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectCartItemCount);

  if (items.length === 0) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://img.icons8.com/3d-fluency/96/shopping-bag.png' }}
            style={styles.headerLogo}
          />
          <View style={styles.headerTitleWrap}>
            <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
              My Cart
            </Text>
            <Text style={[styles.subHeading, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
              Your shopping list is empty
            </Text>
          </View>
        </View>
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Add some products and they'll show up here"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://img.icons8.com/3d-fluency/96/shopping-bag.png' }}
          style={styles.headerLogo}
        />
        <View style={styles.headerTitleWrap}>
          <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
            My Cart
          </Text>
          <Text style={[styles.subHeading, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
            You have {count} items in your cart
          </Text>
        </View>
      </View>

      <TypedFlashList
        data={items}
        keyExtractor={(item: import('../types').CartItem) => String(item.product.id)}
        renderItem={({ item }: { item: import('../types').CartItem }) => <CartItemComponent item={item} />}
        estimatedItemSize={100}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />

      {/* Summary footer */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
            Total
          </Text>
          <Text style={[styles.totalValue, { color: colors.primary, fontFamily: typography.fontFamily.bold }]}>
            {formatCurrency(total)}
          </Text>
        </View>
        <Button
          label="Proceed to Checkout"
          onPress={() => navigation.navigate('Checkout')}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerLogo: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
  },
  headerTitleWrap: {
    flex: 1,
  },
  heading: {
    fontSize: typography.h2.fontSize,
  },
  subHeading: {
    fontSize: typography.caption.fontSize,
    marginTop: 2,
  },
  list: { paddingVertical: spacing.sm, paddingBottom: spacing.lg },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  totalLabel: { fontSize: typography.h3.fontSize },
  totalValue: { fontSize: typography.h2.fontSize },
});
