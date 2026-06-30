import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { useTheme } from '../../core/theme/ThemeContext';
import { typography } from '../../core/theme/typography';
import { spacing, radius } from '../../core/theme/spacing';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const { colors } = useTheme();
  const isDisabled = disabled || isLoading;

  // Dynamic Styles based on Active Theme
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    danger: {
      backgroundColor: colors.error,
    },
  };

  const labelStyles = {
    primary: {
      color: colors.white,
    },
    outline: {
      color: colors.primary,
    },
    ghost: {
      color: colors.primary,
    },
    danger: {
      color: colors.white,
    },
  };

  const buttonStyle = [
    styles.base,
    variantStyles[variant],
    isDisabled && styles.disabled,
    fullWidth && styles.fullWidth,
    style,
  ];

  const content = (
    <View style={styles.contentWrap}>
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? colors.white : colors.primary}
          size="small"
        />
      ) : (
        <Text style={[styles.label, labelStyles[variant], textStyle]}>{label}</Text>
      )}
    </View>
  );

  if (Platform.OS === 'android') {
    return (
      <View style={[styles.androidWrapper, fullWidth && styles.fullWidth, { borderRadius: radius.md }, style]}>
        <TouchableNativeFeedback
          onPress={onPress}
          disabled={isDisabled}
          background={TouchableNativeFeedback.Ripple(
            variant === 'primary' || variant === 'danger' ? 'rgba(255,255,255,0.2)' : 'rgba(42,107,255,0.1)',
            false
          )}
        >
          <View style={[styles.base, variantStyles[variant], isDisabled && styles.disabled, fullWidth && styles.fullWidth]}>
            {content}
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={buttonStyle}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  androidWrapper: {
    overflow: 'hidden',
  },
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  contentWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.bodyLarge.fontSize,
  },
});
