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
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';
import { Spacing } from '../../../core/theme/spacing';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { selectCartItems, selectCartTotal, selectCartItemCount } from '../selectors';
import { clearCart } from '../slice/cartSlice';
import { formatCurrency } from '../../../shared/utils/formatCurrency';
import { CartStackParamList } from '../../../app/navigation/MainTabNavigator';

type Props = NativeStackScreenProps<CartStackParamList, 'Checkout'>;

const addressSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().regex(/^\d{4,10}$/, 'Enter a valid pincode'),
});

type AddressForm = z.infer<typeof addressSchema>;
type PaymentMethod = 'cod' | 'card';

export const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
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
  } = useForm<AddressForm>({ resolver: zodResolver(addressSchema) });

  const onPlaceOrder = async () => {
    setIsPlacing(true);
    // Fake processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const orderId = `ORD-${Date.now()}`;
    dispatch(clearCart());
    setIsPlacing(false);
    navigation.replace('OrderSuccess', { orderId });
  };

  const deliveryFee = total > 50 ? 0 : 4.99;
  const grandTotal = total + deliveryFee;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Go back">
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>Checkout</Text>
          </View>

          {/* Order summary */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            {items.map(item => (
              <View key={item.product.id} style={styles.summaryRow}>
                <Text style={styles.summaryItem} numberOfLines={1}>
                  {item.product.title} ×{item.quantity}
                </Text>
                <Text style={styles.summaryPrice}>
                  {formatCurrency((item.product.price * (1 - item.product.discountPercentage / 100)) * item.quantity)}
                </Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryItem}>Items ({count})</Text>
              <Text style={styles.summaryPrice}>{formatCurrency(total)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryItem}>Delivery</Text>
              <Text style={[styles.summaryPrice, deliveryFee === 0 && styles.free]}>
                {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(grandTotal)}</Text>
            </View>
          </View>

          {/* Address */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
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
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            {(['cod', 'card'] as PaymentMethod[]).map(method => (
              <TouchableOpacity
                key={method}
                style={[styles.payOption, payment === method && styles.payOptionActive]}
                onPress={() => setPayment(method)}
                accessibilityRole="radio"
                accessibilityState={{ checked: payment === method }}
              >
                <Text style={styles.payIcon}>{method === 'cod' ? '💵' : '💳'}</Text>
                <Text style={[styles.payLabel, payment === method && styles.payLabelActive]}>
                  {method === 'cod' ? 'Cash on Delivery' : 'Credit / Debit Card'}
                </Text>
                <View style={[styles.radio, payment === method && styles.radioActive]} />
              </TouchableOpacity>
            ))}
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
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg, gap: Spacing.md },
  backIcon: { fontSize: 22, color: Colors.textPrimary },
  heading: { ...Typography.h2, color: Colors.textPrimary },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: Spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  summaryItem: { ...Typography.body2, color: Colors.textSecondary, flex: 1, marginRight: Spacing.sm },
  summaryPrice: { ...Typography.body2, color: Colors.textPrimary, fontWeight: '600' },
  free: { color: Colors.success },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  totalRow: { marginTop: Spacing.xs },
  totalLabel: { ...Typography.h4, color: Colors.textPrimary },
  totalValue: { ...Typography.h3, color: Colors.primary },
  row: { flexDirection: 'row', gap: Spacing.sm },
  half: { flex: 1 },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  payOptionActive: { borderColor: Colors.primary, backgroundColor: '#F0EEFF' },
  payIcon: { fontSize: 20 },
  payLabel: { ...Typography.body1, color: Colors.textSecondary, flex: 1 },
  payLabelActive: { color: Colors.primary, fontWeight: '600' },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: Colors.border,
  },
  radioActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  placeBtn: { marginTop: Spacing.sm },
});
