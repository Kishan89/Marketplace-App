import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { logoutThunk } from '../slice/authSlice';
import { useTheme } from '../../../core/theme/ThemeContext';
import { typography } from '../../../core/theme/typography';
import { spacing, radius } from '../../../core/theme/spacing';
import { selectCartItemCount, selectCartTotal } from '../../cart/selectors';
import { formatCurrency } from '../../../shared/utils/formatCurrency';

export const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { colors, toggleTheme, isDark } = useTheme();
  const user = useAppSelector(state => state.auth.user);
  const cartCount = useAppSelector(selectCartItemCount);
  const cartTotal = useAppSelector(selectCartTotal);

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  const renderSettingRow = (
    iconName: keyof typeof Feather.glyphMap,
    label: string,
    value?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => {
    const content = (
      <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
        <View style={styles.settingLabelWrap}>
          <Feather name={iconName} size={18} color={colors.textSecondary} style={styles.settingIcon} />
          <Text style={[styles.settingLabel, { color: colors.textPrimary, fontFamily: typography.fontFamily.medium }]}>
            {label}
          </Text>
        </View>
        <View style={styles.settingRightWrap}>
          {value ? (
            <Text style={[styles.settingValue, { color: colors.textTertiary, fontFamily: typography.fontFamily.regular }]}>
              {value}
            </Text>
          ) : null}
          {rightElement ? rightElement : onPress ? (
            <Feather name="chevron-right" size={16} color={colors.textTertiary} />
          ) : null}
        </View>
      </View>
    );

    if (onPress) {
      return (
        <TouchableOpacity key={label} onPress={onPress} activeOpacity={0.7}>
          {content}
        </TouchableOpacity>
      );
    }

    return <View key={label}>{content}</View>;
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://img.icons8.com/3d-fluency/96/shopping-bag.png' }}
          style={styles.headerLogo}
        />
        <View style={styles.headerTitleWrap}>
          <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
            Profile
          </Text>
          <Text style={[styles.subHeading, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
            Manage your account settings
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* User Header */}
        <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Image
            source={{ uri: user?.image && !user.image.includes('dummyjson.com/icon') ? user.image : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80' }}
            style={[styles.avatar, { borderColor: colors.border }]}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.headerInfo}>
            <Text style={[styles.name, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={[styles.email, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
              {user?.email}
            </Text>
          </View>
        </View>

        {/* Quick Stats Card */}
        <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.statColumn}>
            <Text style={[styles.statValue, { color: colors.primary, fontFamily: typography.fontFamily.bold }]}>
              {cartCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
              Cart Items
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statColumn}>
            <Text style={[styles.statValue, { color: colors.primary, fontFamily: typography.fontFamily.bold }]}>
              {formatCurrency(cartTotal)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
              Cart Value
            </Text>
          </View>
        </View>

        {/* Account Details */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: typography.fontFamily.bold }]}>
          ACCOUNT
        </Text>
        <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {renderSettingRow('user', 'Personal Info')}
          {renderSettingRow('map-pin', 'Delivery Addresses', 'Default Address', () => {})}
        </View>

        {/* Preferences */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: typography.fontFamily.bold }]}>
          PREFERENCES
        </Text>
        <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {renderSettingRow(
            isDark ? 'moon' : 'sun',
            'Dark Mode',
            undefined,
            undefined,
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          )}
          {renderSettingRow('globe', 'Language', 'English (IN)', () => {})}
        </View>

        {/* Support */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: typography.fontFamily.bold }]}>
          SUPPORT
        </Text>
        <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {renderSettingRow('help-circle', 'Help & Support', undefined, () => {})}
          {renderSettingRow('file-text', 'Privacy Policy & Terms', undefined, () => {})}
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: colors.surface, borderColor: colors.error }]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Feather name="log-out" size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error, fontFamily: typography.fontFamily.bold }]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
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
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  name: {
    fontSize: typography.h3.fontSize,
    marginBottom: 2,
  },
  email: {
    fontSize: typography.caption.fontSize,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.h2.fontSize,
  },
  statLabel: {
    fontSize: typography.caption.fontSize,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  sectionTitle: {
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.sm,
    letterSpacing: 1.2,
  },
  groupCard: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  settingLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: typography.body.fontSize,
  },
  settingRightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingValue: {
    fontSize: typography.body.fontSize,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  logoutText: {
    fontSize: typography.bodyLarge.fontSize,
  },
});
