import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../core/theme/ThemeContext';
import { typography } from '../../core/theme/typography';
import { spacing } from '../../core/theme/spacing';
import { Button } from './Button';

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  message = 'Something went wrong. Please try again.',
  onRetry,
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} accessibilityRole="alert">
      <Text style={styles.icon}>⚠️</Text>
      <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
        Oops!
      </Text>
      <Text style={[styles.message, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
        {message}
      </Text>
      {onRetry ? (
        <Button
          label="Try Again"
          onPress={onRetry}
          variant="outline"
          style={styles.button}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.h3.fontSize,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: typography.body.fontSize,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 260,
  },
  button: {
    paddingHorizontal: spacing.xl,
  },
});
