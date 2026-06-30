import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../core/theme/colors';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  return (
    <Animated.View
      style={[styles.skeleton, { width: width as number, height, borderRadius, opacity }, style]}
    />
  );
};

// Product card skeleton
export const ProductCardSkeleton: React.FC = () => (
  <View style={styles.card}>
    <SkeletonLoader height={160} borderRadius={12} />
    <SkeletonLoader height={14} style={styles.mt8} />
    <SkeletonLoader width="60%" height={14} style={styles.mt4} />
    <SkeletonLoader width="40%" height={18} style={styles.mt8} />
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.skeletonBase,
  },
  card: {
    flex: 1,
    margin: 6,
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
});
