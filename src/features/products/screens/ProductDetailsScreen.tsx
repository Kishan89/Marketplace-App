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
import { useGetProductByIdQuery } from '../api/productsApi';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';
import { Spacing } from '../../../core/theme/spacing';
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
      <SafeAreaView style={styles.safe}>
        <View style={styles.backBtn}>
          <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Go back">
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.skeletonScroll}>
          <SkeletonLoader height={300} borderRadius={0} />
          <View style={styles.skeletonContent}>
            <SkeletonLoader height={14} width="50%" />
            <SkeletonLoader height={22} style={{ marginTop: 8 }} />
            <SkeletonLoader height={22} width="70%" style={{ marginTop: 4 }} />
            <SkeletonLoader height={30} width="40%" style={{ marginTop: 16 }} />
            <SkeletonLoader height={14} style={{ marginTop: 16 }} />
            <SkeletonLoader height={14} style={{ marginTop: 6 }} />
            <SkeletonLoader height={14} width="80%" style={{ marginTop: 6 }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError || !product) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorView message="Could not load product details." onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          {hasDiscount ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{Math.round(product.discountPercentage)}%</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.content}>
          {/* Category + Rating */}
          <View style={styles.metaRow}>
            <Text style={styles.category}>{product.category}</Text>
            <View style={styles.ratingPill}>
              <Text style={styles.star}>⭐</Text>
              <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
            </View>
          </View>

          <Text style={styles.title}>{product.title}</Text>
          {product.brand ? <Text style={styles.brand}>by {product.brand}</Text> : null}

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatCurrency(discountedPrice)}</Text>
            {hasDiscount ? (
              <Text style={styles.originalPrice}>{formatCurrency(product.price)}</Text>
            ) : null}
          </View>

          {/* Stock */}
          <Text style={styles.stock}>
            {product.stock > 10
              ? '✅ In Stock'
              : product.stock > 0
              ? `⚠️ Only ${product.stock} left`
              : '❌ Out of Stock'}
          </Text>

          {/* Description */}
          <Text style={styles.sectionTitle}>About this product</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Quantity stepper */}
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setQuantity(q => Math.max(1, q - 1))}
              accessibilityLabel="Decrease quantity"
              accessibilityRole="button"
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{quantity}</Text>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setQuantity(q => Math.min(product.stock, q + 1))}
              accessibilityLabel="Increase quantity"
              accessibilityRole="button"
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {inCartQty > 0 ? (
            <Text style={styles.inCartHint}>Already {inCartQty} in cart</Text>
          ) : null}

          <Button
            label={`Add to Cart · ${formatCurrency(discountedPrice * quantity)}`}
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
  safe: { flex: 1, backgroundColor: Colors.background },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 320, backgroundColor: Colors.skeletonBase },
  backBtn: {
    position: 'absolute',
    top: Spacing.base,
    left: Spacing.base,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backIcon: { fontSize: 20, color: Colors.textPrimary },
  discountBadge: {
    position: 'absolute',
    top: Spacing.base,
    right: Spacing.base,
    backgroundColor: Colors.error,
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  discountText: { ...Typography.body2, color: Colors.white, fontWeight: '700' },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  category: { ...Typography.caption, color: Colors.textDisabled, textTransform: 'capitalize' },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.skeletonBase,
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    gap: 4,
  },
  star: { fontSize: 12 },
  rating: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  title: { ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.xs },
  brand: { ...Typography.body2, color: Colors.textSecondary, marginBottom: Spacing.sm },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  price: { ...Typography.h3, color: Colors.primary },
  originalPrice: { ...Typography.body1, color: Colors.textDisabled, textDecorationLine: 'line-through' },
  stock: { ...Typography.body2, marginBottom: Spacing.base },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: Spacing.sm, marginTop: Spacing.base },
  description: { ...Typography.body1, color: Colors.textSecondary, lineHeight: 22 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: Spacing.base, marginBottom: Spacing.sm },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: { fontSize: 20, color: Colors.white, fontWeight: '600', lineHeight: 24 },
  qty: { ...Typography.h3, color: Colors.textPrimary, minWidth: 40, textAlign: 'center' },
  inCartHint: { ...Typography.caption, color: Colors.accent, marginBottom: Spacing.sm },
  addBtn: { marginTop: Spacing.sm },
  skeletonScroll: { paddingBottom: Spacing.xxl },
  skeletonContent: { padding: Spacing.base },
});
