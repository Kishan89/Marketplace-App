import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '../../../core/theme/ThemeContext';
import { typography } from '../../../core/theme/typography';
import { spacing, radius } from '../../../core/theme/spacing';
import { Button } from '../../../shared/components/Button';
import { Feather } from '@expo/vector-icons';
import { Input } from '../../../shared/components/Input';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { selectCartItems, selectCartTotal, selectCartItemCount } from '../selectors';
import { clearCart } from '../slice/cartSlice';
import { formatCurrency } from '../../../shared/utils/formatCurrency';
import { CartStackParamList } from '../../../app/navigation/MainTabNavigator';

type Props = NativeStackScreenProps<CartStackParamList, 'Checkout'>;

const addressSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name (min 2 characters)'),
  address: z.string().trim().min(10, 'Please enter a detailed delivery address (min 10 characters)'),
  city: z.string().trim().min(2, 'Please enter your city name'),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Please enter a valid 6-digit pincode'),
});

type AddressForm = z.infer<typeof addressSchema>;
type PaymentMethod = 'cod' | 'card';

export const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectCartItemCount);
  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const [isPlacing, setIsPlacing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      pincode: '',
    },
  });

  const onPlaceOrder = async () => {
    setIsPlacing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const orderId = `ORD-${Date.now()}`;
    dispatch(clearCart());
    setIsPlacing(false);
    navigation.replace('OrderSuccess', { orderId });
  };

  const deliveryFee = total > 50 ? 0 : 4.99;
  const grandTotal = total + deliveryFee;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Go back">
              <Feather name="chevron-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
              Checkout
            </Text>
          </View>

          {/* Order summary */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
              Order Summary
            </Text>
            {items.map((item: import('../types').CartItem) => (
              <View key={item.product.id} style={styles.summaryRow}>
                <Text style={[styles.summaryItem, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]} numberOfLines={1}>
                  {item.product.title} ×{item.quantity}
                </Text>
                <Text style={[styles.summaryPrice, { color: colors.textPrimary, fontFamily: typography.fontFamily.semibold }]}>
                  {formatCurrency((item.product.price * (1 - item.product.discountPercentage / 100)) * item.quantity)}
                </Text>
              </View>
            ))}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryItem, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                Items ({count})
              </Text>
              <Text style={[styles.summaryPrice, { color: colors.textPrimary, fontFamily: typography.fontFamily.semibold }]}>
                {formatCurrency(total)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryItem, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                Delivery
              </Text>
              <Text style={[styles.summaryPrice, { fontFamily: typography.fontFamily.semibold }, deliveryFee === 0 ? { color: colors.success } : { color: colors.textPrimary }]}>
                {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={[styles.totalLabel, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
                Total
              </Text>
              <Text style={[styles.totalValue, { color: colors.primary, fontFamily: typography.fontFamily.bold }]}>
                {formatCurrency(grandTotal)}
              </Text>
            </View>
          </View>

          {/* Address */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
              Delivery Address
            </Text>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label="Full Name" placeholder="John Doe" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.fullName?.message} />
              )}
            />
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label="Address" placeholder="123 Main Street" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.address?.message} />
              )}
            />
            <View style={styles.row}>
              <View style={styles.half}>
                <Controller
                  control={control}
                  name="city"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input label="City" placeholder="Mumbai" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.city?.message} />
                  )}
                />
              </View>
              <View style={styles.half}>
                <Controller
                  control={control}
                  name="pincode"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input label="Pincode" placeholder="400001" keyboardType="numeric" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.pincode?.message} />
                  )}
                />
              </View>
            </View>
          </View>

          {/* Payment */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
              Payment Method
            </Text>
            {(['cod', 'card'] as PaymentMethod[]).map(method => {
              const isActive = payment === method;
              return (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.payOption,
                    {
                      borderColor: isActive ? colors.primary : colors.border,
                      backgroundColor: isActive ? colors.primaryLight : 'transparent',
                    },
                  ]}
                  onPress={() => setPayment(method)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isActive }}
                >
                  <Text style={styles.payIcon}>{method === 'cod' ? '💵' : '💳'}</Text>
                  <Text style={[
                    styles.payLabel,
                    {
                      color: isActive ? colors.primary : colors.textSecondary,
                      fontFamily: isActive ? typography.fontFamily.semibold : typography.fontFamily.regular,
                    },
                  ]}>
                    {method === 'cod' ? 'Cash on Delivery' : 'Credit / Debit Card'}
                  </Text>
                  <View style={[
                    styles.radio,
                    {
                      borderColor: isActive ? colors.primary : colors.border,
                      backgroundColor: isActive ? colors.primary : 'transparent',
                    },
                  ]} />
                </TouchableOpacity>
              );
            })}
          </View>

          <Button
            label={`Place Order · ${formatCurrency(grandTotal)}`}
            onPress={handleSubmit(onPlaceOrder)}
            isLoading={isPlacing}
            fullWidth
            style={styles.placeBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg, gap: spacing.md },
  backIcon: { fontSize: 22 },
  heading: { fontSize: typography.h2.fontSize },
  card: {
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
  },
  sectionTitle: { fontSize: typography.h3.fontSize, marginBottom: spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  summaryItem: { fontSize: typography.body.fontSize, flex: 1, marginRight: spacing.sm },
  summaryPrice: { fontSize: typography.body.fontSize },
  divider: { height: 1, marginVertical: spacing.sm },
  totalRow: { marginTop: spacing.xs },
  totalLabel: { fontSize: typography.h3.fontSize },
  totalValue: { fontSize: typography.h2.fontSize },
  row: { flexDirection: 'row', gap: spacing.sm },
  half: { flex: 1 },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  payIcon: { fontSize: 20 },
  payLabel: { fontSize: typography.bodyLarge.fontSize, flex: 1 },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2,
  },
  placeBtn: { marginTop: spacing.sm },
});
