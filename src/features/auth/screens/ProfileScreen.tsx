import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { logoutThunk } from '../slice/authSlice';
import { Button } from '../../../shared/components/Button';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';
import { Spacing } from '../../../core/theme/spacing';
import { selectCartItemCount, selectCartTotal } from '../../cart/selectors';
import { formatCurrency } from '../../../shared/utils/formatCurrency';

export const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const cartCount = useAppSelector(selectCartItemCount);
  const cartTotal = useAppSelector(selectCartTotal);

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Profile</Text>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <Image
            source={{ uri: user?.image ?? 'https://dummyjson.com/icon/emilys/128' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{cartCount}</Text>
            <Text style={styles.statLabel}>Cart Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(cartTotal)}</Text>
            <Text style={styles.statLabel}>Cart Total</Text>
          </View>
        </View>

        <Button
          label="Sign Out"
          onPress={handleLogout}
          variant="outline"
          fullWidth
          style={styles.logout}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  heading: { ...Typography.h2, color: Colors.textPrimary, marginBottom: Spacing.lg },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.xl },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.md,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  name: { ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.xs },
  email: { ...Typography.body2, color: Colors.textSecondary },
  statsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.base,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: { ...Typography.h3, color: Colors.primary },
  statLabel: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.xs },
  logout: { marginTop: Spacing.sm },
});
