import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGetProductsQuery, useSearchProductsQuery, useGetCategoriesQuery } from '../api/productsApi';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../../../shared/components/SkeletonLoader';
import { ErrorView } from '../../../shared/components/ErrorView';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';
import { Spacing } from '../../../core/theme/spacing';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { Product } from '../types';
import { HomeStackParamList } from '../../../app/navigation/MainTabNavigator';

type Props = NativeStackScreenProps<HomeStackParamList, 'ProductList'>;

const SKELETONS = Array.from({ length: 6 }, (_, i) => i);

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const isSearching = debouncedSearch.trim().length > 0;

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isProductsError,
    refetch: refetchProducts,
    isFetching,
  } = useGetProductsQuery(
    { category: selectedCategory ?? undefined },
    { skip: isSearching },
  );

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchProductsQuery(debouncedSearch, { skip: !isSearching });

  const { data: categories } = useGetCategoriesQuery();

  const products = isSearching
    ? searchData?.products ?? []
    : productsData?.products ?? [];

  const isLoading = isSearching ? isSearchLoading : isLoadingProducts;
  const isError = isSearching ? isSearchError : isProductsError;

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetails', { productId: product.id });
    },
    [navigation],
  );

  const renderHeader = () => (
    <View>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={Colors.textDisabled}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          accessibilityLabel="Search products"
        />
        {searchQuery.length > 0 ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} accessibilityLabel="Clear search">
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category chips */}
      {categories && !isSearching ? (
        <FlatList
          horizontal
          data={[{ slug: null, name: 'All', url: '' }, ...categories.slice(0, 10)]}
          keyExtractor={item => item.slug ?? 'all'}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, selectedCategory === item.slug && styles.chipActive]}
              onPress={() => setSelectedCategory(item.slug)}
              accessibilityLabel={`Filter by ${item.name}`}
            >
              <Text
                style={[styles.chipText, selectedCategory === item.slug && styles.chipTextActive]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : null}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.heading}>🛍️ Marketplace</Text>
        </View>
        {renderHeader()}
        <View style={styles.skeletonGrid}>
          {SKELETONS.map(i => (
            <ProductCardSkeleton key={i} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorView
          message="Failed to load products. Check your connection."
          onRetry={refetchProducts}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.heading}>🛍️ Marketplace</Text>
      </View>

      <FlashList
        data={products}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={handleProductPress} />
        )}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        estimatedItemSize={260}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            title="No products found"
            message={isSearching ? `No results for "${debouncedSearch}"` : 'No products available'}
          />
        }
        contentContainerStyle={styles.list}
        onRefresh={refetchProducts}
        refreshing={isFetching && !isLoading}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.base, paddingTop: Spacing.sm, paddingBottom: Spacing.xs },
  heading: { ...Typography.h2, color: Colors.textPrimary },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 48,
  },
  searchIcon: { fontSize: 16, marginRight: Spacing.sm },
  searchInput: {
    flex: 1,
    ...Typography.body1,
    color: Colors.textPrimary,
  },
  clearBtn: { fontSize: 14, color: Colors.textDisabled, padding: 4 },
  chips: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.md, gap: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { ...Typography.caption, color: Colors.textSecondary, textTransform: 'capitalize' },
  chipTextActive: { color: Colors.white, fontWeight: '600' },
  list: { paddingHorizontal: Spacing.sm, paddingBottom: Spacing.xxl },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.sm,
  },
});
