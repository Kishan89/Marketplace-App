import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../core/theme/ThemeContext';
import { typography } from '../../../core/theme/typography';
import { spacing, radius } from '../../../core/theme/spacing';
import { Button } from '../../../shared/components/Button';
import { CartStackParamList } from '../../../app/navigation/MainTabNavigator';

type Props = NativeStackScreenProps<CartStackParamList, 'OrderSuccess'>;

export const OrderSuccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const { colors, isDark } = useTheme();
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
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.container, { opacity }]}>
        <Animated.View style={[
          styles.iconWrap, 
          { 
            transform: [{ scale }],
            backgroundColor: isDark ? 'rgba(34, 197, 94, 0.15)' : '#E8FFF4',
            borderColor: isDark ? 'rgba(34, 197, 94, 0.3)' : '#D1FAE5'
          }
        ]}>
          <Feather name="check" size={48} color={isDark ? '#4ADE80' : '#10B981'} />
        </Animated.View>

        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
          Order Placed!
        </Text>
        <Text style={[styles.message, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
          Your order has been confirmed and will be delivered soon.
        </Text>

        <View style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.orderLabel, { color: colors.textTertiary, fontFamily: typography.fontFamily.medium }]}>
            Order ID
          </Text>
          <Text style={[styles.orderId, { color: colors.primary, fontFamily: typography.fontFamily.bold }]}>
            {orderId}
          </Text>
        </View>

        <Button
          label="Continue Shopping"
          onPress={() => navigation.popToTop()}
          fullWidth
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { fontSize: typography.h1.fontSize, marginBottom: spacing.sm },
  message: {
    fontSize: typography.bodyLarge.fontSize,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  orderCard: {
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.xl,
    borderWidth: 1,
  },
  orderLabel: { fontSize: typography.caption.fontSize, marginBottom: spacing.xs },
  orderId: { fontSize: typography.h3.fontSize },
});
