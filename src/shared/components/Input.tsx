import React, { forwardRef, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../core/theme/ThemeContext';
import { typography } from '../../core/theme/typography';
import { spacing, radius } from '../../core/theme/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerStyle, style, ...rest }, ref) => {
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={[styles.container, containerStyle]}>
        {label ? (
          <Text style={[styles.label, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
            {label}
          </Text>
        ) : null}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
              color: colors.textPrimary,
              fontFamily: typography.fontFamily.regular,
            },
            style,
          ]}
          placeholderTextColor={colors.textTertiary}
          accessibilityLabel={label}
          accessibilityHint={error}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        {error ? (
          <Text style={[styles.errorText, { color: colors.error }]} accessibilityRole="alert">
            {error}
          </Text>
        ) : null}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.body.fontSize,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.bodyLarge.fontSize,
    minHeight: 48,
  },
  errorText: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.fontFamily.regular,
    marginTop: spacing.xs,
  },
});
