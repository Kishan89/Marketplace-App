import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useGetProductByIdQuery } from '../api/productsApi';
import { useTheme } from '../../../core/theme/ThemeContext';
import { typography } from '../../../core/theme/typography';
import { spacing, radius } from '../../../core/theme/spacing';
import { Button } from '../../../shared/components/Button';
import { SkeletonLoader } from '../../../shared/components/SkeletonLoader';
import { ErrorView } from '../../../shared/components/ErrorView';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { addItem } from '../../cart/slice/cartSlice';
import { selectItemById } from '../../cart/selectors';
import { formatCurrency, calculateDiscountedPrice } from '../../../shared/utils/formatCurrency';
import { HomeStackParamList } from '../../../app/navigation/MainTabNavigator';

type Props = NativeStackScreenProps<HomeStackParamList, 'ProductDetails'>;

export const ProductDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId } = route.params;
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError, refetch } = useGetProductByIdQuery(productId);
  const cartItem = useAppSelector(selectItemById(productId));
  const inCartQty = cartItem?.quantity ?? 0;

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addItem({ product, quantity }));
    Toast.show({
      type: 'success',
      text1: 'Added to cart! 🛒',
      text2: `${quantity}× ${product.title}`,
      visibilityTime: 2000,
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Go back">
            <Feather name="chevron-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.skeletonScroll}>
          <SkeletonLoader height={300} borderRadius={0} />
          <View style={styles.skeletonContent}>
            <SkeletonLoader height={14} width="30%" />
            <SkeletonLoader height={22} style={{ marginTop: 12 }} />
            <SkeletonLoader height={22} width="70%" style={{ marginTop: 6 }} />
            <SkeletonLoader height={30} width="40%" style={{ marginTop: 24 }} />
            <SkeletonLoader height={14} style={{ marginTop: 24 }} />
            <SkeletonLoader height={14} style={{ marginTop: 8 }} />
            <SkeletonLoader height={14} width="80%" style={{ marginTop: 8 }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError || !product) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <ErrorView message="Could not load product details." onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* Image Container with Floating Actions */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.thumbnail }}
            style={[styles.image, { backgroundColor: colors.skeletonBase }]}
            contentFit="cover"
            transition={300}
          />
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Feather name="chevron-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          {hasDiscount ? (
            <View style={[styles.discountBadge, { backgroundColor: colors.discount }]}>
              <Text style={styles.discountText}>-{Math.round(product.discountPercentage)}%</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.content}>
          {/* Category + Rating */}
          <View style={styles.metaRow}>
            <Text style={[styles.category, { color: colors.textTertiary, fontFamily: typography.fontFamily.medium }]}>
              {product.category}
            </Text>
            <View style={[styles.ratingPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <FontAwesome name="star" size={13} color="#F59E0B" />
              <Text style={[styles.rating, { color: colors.textSecondary, fontFamily: typography.fontFamily.semibold }]}>
                {product.rating.toFixed(1)}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
            {product.title}
          </Text>
          {product.brand ? (
            <Text style={[styles.brand, { color: colors.textSecondary, fontFamily: typography.fontFamily.medium }]}>
              by {product.brand}
            </Text>
          ) : null}

          {/* Price Layout */}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.primary, fontFamily: typography.fontFamily.bold }]}>
              {formatCurrency(discountedPrice)}
            </Text>
            {hasDiscount ? (
              <Text style={[styles.originalPrice, { color: colors.textTertiary, fontFamily: typography.fontFamily.regular }]}>
                {formatCurrency(product.price)}
              </Text>
            ) : null}
          </View>

          {/* Stock Status Card */}
          <View style={[styles.stockCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Feather 
              name={product.stock > 10 ? 'check-circle' : product.stock > 0 ? 'alert-triangle' : 'x-circle'} 
              size={16} 
              color={product.stock > 10 ? '#10B981' : product.stock > 0 ? '#F59E0B' : colors.error} 
            />
            <Text style={[styles.stockText, { 
              color: product.stock > 10 ? '#10B981' : product.stock > 0 ? '#F59E0B' : colors.error, 
              fontFamily: typography.fontFamily.medium,
              marginLeft: spacing.xs
            }]}>
              {product.stock > 10
                ? 'In Stock'
                : product.stock > 0
                ? `Only ${product.stock} left in stock`
                : 'Out of Stock'}
            </Text>
          </View>

          {/* Description */}
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
            About this product
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
            {product.description}
          </Text>

          {/* Quantity selector */}
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
            Quantity
          </Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[styles.stepBtn, { backgroundColor: colors.primaryLight }]}
              onPress={() => setQuantity(q => Math.max(1, q - 1))}
              accessibilityLabel="Decrease quantity"
              accessibilityRole="button"
            >
              <Feather name="minus" size={16} color={colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.qty, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
              {quantity}
            </Text>
            <TouchableOpacity
              style={[styles.stepBtn, { backgroundColor: colors.primaryLight }]}
              onPress={() => setQuantity(q => Math.min(product.stock, q + 1))}
              accessibilityLabel="Increase quantity"
              accessibilityRole="button"
            >
              <Feather name="plus" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {inCartQty > 0 ? (
            <Text style={[styles.inCartHint, { color: colors.primary, fontFamily: typography.fontFamily.medium }]}>
              Already {inCartQty} in cart
            </Text>
          ) : null}

          <Button
            label={product.stock === 0 ? 'Out of Stock' : `Add to Cart · ${formatCurrency(discountedPrice * quantity)}`}
            onPress={handleAddToCart}
            fullWidth
            disabled={product.stock === 0}
            style={styles.addBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 320 },
  backBtn: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.lg,
    borderRadius: radius.full,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 1,
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.lg,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  discountText: { fontSize: typography.caption.fontSize, color: '#FFFFFF', fontWeight: '700' },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  category: { fontSize: typography.caption.fontSize, textTransform: 'capitalize' },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    gap: 4,
  },
  rating: { fontSize: typography.caption.fontSize, marginLeft: 2 },
  title: { fontSize: typography.h2.fontSize, marginBottom: spacing.xs },
  brand: { fontSize: typography.body.fontSize, marginBottom: spacing.md },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginBottom: spacing.md },
  price: { fontSize: typography.price.fontSize },
  originalPrice: { fontSize: typography.body.fontSize, textDecorationLine: 'line-through' },
  stockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  stockText: { fontSize: typography.body.fontSize },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  description: { fontSize: typography.bodyLarge.fontSize, lineHeight: 24 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.md },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { fontSize: typography.h3.fontSize, minWidth: 40, textAlign: 'center' },
  inCartHint: { fontSize: typography.caption.fontSize, marginBottom: spacing.md },
  addBtn: { marginTop: spacing.md },
  skeletonScroll: { paddingBottom: spacing.xxl },
  skeletonContent: { padding: spacing.lg },
});
