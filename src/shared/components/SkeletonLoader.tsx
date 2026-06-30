import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../core/theme/ThemeContext';
import { spacing, radius } from '../../core/theme/spacing';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = radius.sm,
  style,
}) => {
  const { colors, isDark } = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: isDark ? [0.6, 0.95] : [0.4, 0.85],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
          opacity,
          backgroundColor: colors.skeletonBase,
        },
        style,
      ]}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <SkeletonLoader height={150} borderRadius={radius.md} />
      <View style={styles.info}>
        <SkeletonLoader width="35%" height={10} style={styles.mt8} />
        <SkeletonLoader height={14} style={styles.mt8} />
        <SkeletonLoader width="70%" height={14} style={styles.mt4} />
        <SkeletonLoader width="40%" height={18} style={styles.mt8} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    margin: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  info: {
    padding: spacing.sm,
  },
  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
});
