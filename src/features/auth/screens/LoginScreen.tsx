import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { loginThunk, clearError } from '../slice/authSlice';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { useTheme } from '../../../core/theme/ThemeContext';
import { typography } from '../../../core/theme/typography';
import { spacing, radius } from '../../../core/theme/spacing';
import { LoginFormValues } from '../types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { colors, isDark } = useTheme();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    dispatch(clearError());
    dispatch(loginThunk(values));
  };

  // Premium dark-mode gradient (deep slate) vs light-mode gradient (deep corporate blue)
  const gradientColors = isDark 
    ? (['#0B0F19', '#111827', '#1F2937'] as const)
    : (['#002254', '#003684', '#1A56B0'] as const);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={[styles.logoWrap, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                <Image
                  source={{ uri: 'https://img.icons8.com/3d-fluency/96/shopping-bag.png' }}
                  style={styles.logoImage}
                />
              </View>
              <Text style={[styles.title, { color: '#FFFFFF', fontFamily: typography.fontFamily.bold }]}>
                Marketplace
              </Text>
              <Text style={[styles.subtitle, { color: 'rgba(255, 255, 255, 0.8)', fontFamily: typography.fontFamily.medium }]}>
                Discover premium products near you
              </Text>
            </View>

            {/* Clean Enterprise Login Card */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
                Sign In
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
                Enter your credentials to access your account
              </Text>

              {error ? (
                <View style={[styles.errorBanner, { 
                  backgroundColor: isDark ? '#2D1618' : '#FDF2F2',
                  borderLeftColor: colors.error 
                }]} accessibilityRole="alert">
                  <Text style={[styles.errorText, { color: colors.error, fontFamily: typography.fontFamily.medium }]}>{error}</Text>
                </View>
              ) : null}

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email Address"
                    placeholder="name@company.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="••••••••"
                    secureTextEntry
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.password?.message}
                  />
                )}
              />

              <TouchableOpacity style={styles.forgotRow} activeOpacity={0.7}>
                <Text style={[styles.forgotText, { color: colors.primary, fontFamily: typography.fontFamily.semibold }]}>
                  Forgot password?
                </Text>
              </TouchableOpacity>

              <Button
                label="Sign In"
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
                fullWidth
                style={styles.loginBtn}
              />

              <Text style={[styles.hint, { color: colors.textTertiary, fontFamily: typography.fontFamily.regular }]}>
                Hint: Any email + password (6+ chars) works 🎉
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  gradient: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
  },
  title: {
    fontSize: typography.h2.fontSize,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: typography.h2.fontSize,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: typography.body.fontSize,
    marginBottom: spacing.xl,
  },
  errorBanner: {
    borderLeftWidth: 4,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: typography.body.fontSize,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
    marginTop: -spacing.xs,
  },
  forgotText: {
    fontSize: typography.label.fontSize,
  },
  loginBtn: {
    marginTop: spacing.xs,
  },
  hint: {
    fontSize: typography.caption.fontSize,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
