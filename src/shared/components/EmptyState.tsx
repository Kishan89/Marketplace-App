import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../core/theme/ThemeContext';
import { typography } from '../../core/theme/typography';
import { spacing } from '../../core/theme/spacing';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '🛒',
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} accessibilityRole="text">
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
        {title}
      </Text>
      {message ? (
        <Text style={[styles.message, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.button} />
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
    paddingVertical: spacing.xxxl,
  },
  icon: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.h3.fontSize,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: typography.body.fontSize,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 280,
  },
  button: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
});
