import React, { useEffect, useMemo } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { store } from '../../store/store';
import { hydrateStoreFromStorage } from '../../store/store';
import { restoreSessionThunk } from '../../features/auth/slice/authSlice';
import { ThemeProvider, useTheme } from '../../core/theme/ThemeContext';
import { typography } from '../../core/theme/typography';
import { spacing, radius } from '../../core/theme/spacing';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppToast: React.FC = () => {
  const { colors } = useTheme();

  const toastConfig = useMemo(() => ({
    success: ({ text1, text2 }: any) => (
      <View style={[styles.toastCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.toastIconBg, { backgroundColor: colors.primaryLight }]}>
          <Feather name="check" size={16} color={colors.primary} />
        </View>
        <View style={styles.toastTextWrap}>
          {text1 ? (
            <Text style={[styles.toastText1, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
              {text1}
            </Text>
          ) : null}
          {text2 ? (
            <Text style={[styles.toastText2, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
              {text2}
            </Text>
          ) : null}
        </View>
      </View>
    ),
    error: ({ text1, text2 }: any) => (
      <View style={[styles.toastCard, { backgroundColor: colors.surface, borderColor: colors.error }]}>
        <View style={[styles.toastIconBg, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
          <Feather name="x" size={16} color={colors.error} />
        </View>
        <View style={styles.toastTextWrap}>
          {text1 ? (
            <Text style={[styles.toastText1, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
              {text1}
            </Text>
          ) : null}
          {text2 ? (
            <Text style={[styles.toastText2, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
              {text2}
            </Text>
          ) : null}
        </View>
      </View>
    ),
  }), [colors]);

  return <Toast config={toastConfig} />;
};

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  useEffect(() => {
    // Hydrate cart + auth session from AsyncStorage on app start
    hydrateStoreFromStorage();
    store.dispatch(restoreSessionThunk());
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <GestureHandlerRootView style={styles.flex}>
          <SafeAreaProvider>
            {children}
            <AppToast />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginTop: spacing.md,
  },
  toastIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  toastTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  toastText1: {
    fontSize: 14,
    marginBottom: 2,
  },
  toastText2: {
    fontSize: 11,
  },
});
