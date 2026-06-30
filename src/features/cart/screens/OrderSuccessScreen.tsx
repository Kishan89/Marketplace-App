import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';
import { Spacing } from '../../../core/theme/spacing';
import { Button } from '../../../shared/components/Button';
import { CartStackParamList } from '../../../app/navigation/MainTabNavigator';

type Props = NativeStackScreenProps<CartStackParamList, 'OrderSuccess'>;

export const OrderSuccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId } = route.params;
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [opacity, scale]);

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.container, { opacity }]}>
        <Animated.View style={[styles.iconWrap, { transform: [{ scale }] }]}>
          <Text style={styles.checkmark}>✅</Text>
        </Animated.View>

        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.message}>
          Your order has been confirmed and will be delivered soon.
        </Text>

        <View style={styles.orderCard}>
          <Text style={styles.orderLabel}>Order ID</Text>
          <Text style={styles.orderId}>{orderId}</Text>
        </View>

        <Button
          label="Continue Shopping"
          onPress={() => navigation.popToTop()}
          fullWidth
          style={styles.btn}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8FFF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  checkmark: { fontSize: 52 },
  title: { ...Typography.h1, color: Colors.textPrimary, marginBottom: Spacing.sm },
  message: {
    ...Typography.body1,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.base,
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderLabel: { ...Typography.caption, color: Colors.textDisabled, marginBottom: Spacing.xs },
  orderId: { ...Typography.h4, color: Colors.primary, fontWeight: '700' },
  btn: {},
});
