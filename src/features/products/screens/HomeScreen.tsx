import React, { useState, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useGetProductsQuery, useSearchProductsQuery, useGetCategoriesQuery } from '../api/productsApi';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../../../shared/components/SkeletonLoader';
import { ErrorView } from '../../../shared/components/ErrorView';
import { EmptyState } from '../../../shared/components/EmptyState';
import { useTheme } from '../../../core/theme/ThemeContext';
import { typography } from '../../../core/theme/typography';
import { spacing, radius } from '../../../core/theme/spacing';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { Product } from '../types';
import { HomeStackParamList } from '../../../app/navigation/MainTabNavigator';
import { SharedTabView } from '../../../shared/components/TabView';
import { calculateDiscountedPrice } from '../../../shared/utils/formatCurrency';
import { Button } from '../../../shared/components/Button';
import { setFilters, resetFilters } from '../slice/filterSlice';

type Props = NativeStackScreenProps<HomeStackParamList, 'ProductList'>;

const SKELETONS = Array.from({ length: 6 }, (_, i) => i);

interface CategoryProductListProps {
  categoryKey: string | null;
  navigation: any;
}

// Dedicated list component per category scene for high performance
const CategoryProductList: React.FC<CategoryProductListProps> = memo(({ categoryKey, navigation }) => {
  const { colors } = useTheme();
  
  // Directly select filter options from Redux to prevent unmounting/remounting CategoryProductList scenes on filter change
  const { sortBy, priceRange, ratingFilter } = useAppSelector(state => state.filters);

  const { data, isLoading, isError, refetch, isFetching } = useGetProductsQuery({
    category: categoryKey ?? undefined,
  });

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetails', { productId: product.id });
    },
    [navigation],
  );

  // Dynamic client-side sorting and filtering of products list
  const sortedProducts = useMemo(() => {
    if (!data?.products) return [];
    let list = [...data.products];

    // Filter by Price Range
    if (priceRange === 'under-500') {
      list = list.filter(p => calculateDiscountedPrice(p.price, p.discountPercentage) < 500);
    } else if (priceRange === '500-1000') {
      list = list.filter(p => {
        const cost = calculateDiscountedPrice(p.price, p.discountPercentage);
        return cost >= 500 && cost <= 1000;
      });
    } else if (priceRange === 'over-1000') {
      list = list.filter(p => calculateDiscountedPrice(p.price, p.discountPercentage) > 1000);
    }

    // Filter by Rating Threshold
    if (ratingFilter === '4.0') {
      list = list.filter(p => p.rating >= 4.0);
    } else if (ratingFilter === '4.5') {
      list = list.filter(p => p.rating >= 4.5);
    }

    // Sort products
    if (sortBy === 'price-low') {
      return list.sort((a, b) => calculateDiscountedPrice(a.price, a.discountPercentage) - calculateDiscountedPrice(b.price, b.discountPercentage));
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => calculateDiscountedPrice(b.price, b.discountPercentage) - calculateDiscountedPrice(a.price, a.discountPercentage));
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [data?.products, sortBy, priceRange, ratingFilter]);

  if (isLoading) {
    return (
      <FlatList
        data={SKELETONS}
        keyExtractor={item => String(item)}
        numColumns={2}
        renderItem={() => <ProductCardSkeleton />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  if (isError) {
    return (
      <ErrorView
        message="Failed to load products. Check your connection."
        onRetry={refetch}
      />
    );
  }

  return (
    <FlatList
      data={sortedProducts}
      renderItem={({ item }) => <ProductCard product={item} onPress={handleProductPress} />}
      keyExtractor={item => String(item.id)}
      numColumns={2}
      ListEmptyComponent={
        <EmptyState
          icon="🔍"
          title="No products found"
          message="No products match your active filters"
        />
      }
      contentContainerStyle={styles.list}
      onRefresh={refetch}
      refreshing={isFetching}
      showsVerticalScrollIndicator={false}
    />
  );
});

CategoryProductList.displayName = 'CategoryProductList';

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  
  // Read applied filters from global Redux store
  const { sortBy, priceRange, ratingFilter } = useAppSelector(state => state.filters);

  // Temporary filters states inside Modal:
  const [tempSortBy, setTempSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');
  const [tempPriceRange, setTempPriceRange] = useState<'all' | 'under-500' | '500-1000' | 'over-1000'>('all');
  const [tempRatingFilter, setTempRatingFilter] = useState<'all' | '4.0' | '4.5'>('all');

  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const isSearching = debouncedSearch.trim().length > 0;

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
    refetch: refetchSearch,
  } = useSearchProductsQuery(debouncedSearch, { skip: !isSearching });

  const { data: categories } = useGetCategoriesQuery();

  const searchProducts = searchData?.products ?? [];

  // Dynamic sorting and filtering for search list items
  const sortedSearchProducts = useMemo(() => {
    let list = [...searchProducts];

    // Filter by Price Range
    if (priceRange === 'under-500') {
      list = list.filter(p => calculateDiscountedPrice(p.price, p.discountPercentage) < 500);
    } else if (priceRange === '500-1000') {
      list = list.filter(p => {
        const cost = calculateDiscountedPrice(p.price, p.discountPercentage);
        return cost >= 500 && cost <= 1000;
      });
    } else if (priceRange === 'over-1000') {
      list = list.filter(p => calculateDiscountedPrice(p.price, p.discountPercentage) > 1000);
    }

    // Filter by Rating Threshold
    if (ratingFilter === '4.0') {
      list = list.filter(p => p.rating >= 4.0);
    } else if (ratingFilter === '4.5') {
      list = list.filter(p => p.rating >= 4.5);
    }

    // Sort products
    if (sortBy === 'price-low') {
      return list.sort((a, b) => calculateDiscountedPrice(a.price, a.discountPercentage) - calculateDiscountedPrice(b.price, b.discountPercentage));
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => calculateDiscountedPrice(b.price, b.discountPercentage) - calculateDiscountedPrice(a.price, a.discountPercentage));
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [searchProducts, sortBy, priceRange, ratingFilter]);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetails', { productId: product.id });
    },
    [navigation],
  );

  const handleProfilePress = () => {
    const parentNavigator = navigation.getParent();
    if (parentNavigator) {
      parentNavigator.navigate('ProfileTab');
    }
  };

  const handleOpenBottomSheet = () => {
    // Sync temporary states with applied states when opening
    setTempSortBy(sortBy);
    setTempPriceRange(priceRange);
    setTempRatingFilter(ratingFilter);
    setShowFilters(true);
  };

  const handleApplyFilters = () => {
    dispatch(setFilters({
      sortBy: tempSortBy,
      priceRange: tempPriceRange,
      ratingFilter: tempRatingFilter
    }));
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setTempSortBy('default');
    setTempPriceRange('all');
    setTempRatingFilter('all');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (sortBy !== 'default') count++;
    if (priceRange !== 'all') count++;
    if (ratingFilter !== 'all') count++;
    return count;
  }, [sortBy, priceRange, ratingFilter]);

  const hasActiveFilters = activeFiltersCount > 0;

  // Construct sliding routes (All + Categories list)
  const routes = useMemo(() => {
    if (!categories) return [{ key: 'all', title: 'All' }];
    return [
      { key: 'all', title: 'All' },
      ...categories.slice(0, 10).map(c => ({ key: c.slug, title: c.name })),
    ];
  }, [categories]);

  const renderScene = useCallback(({ route }: { route: { key: string } }) => {
    return (
      <CategoryProductList
        categoryKey={route.key === 'all' ? null : route.key}
        navigation={navigation}
      />
    );
  }, [navigation]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Page Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://img.icons8.com/3d-fluency/96/shopping-bag.png' }}
          style={styles.headerLogo}
        />
        <View style={styles.headerTitleWrap}>
          <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
            Marketplace
          </Text>
          <Text style={[styles.subHeading, { color: colors.textSecondary, fontFamily: typography.fontFamily.regular }]}>
            Discover products you love
          </Text>
        </View>
        
        {user ? (
          <TouchableOpacity
            style={[styles.avatarWrap, { borderColor: colors.border }]}
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: user.image && !user.image.includes('dummyjson.com/icon') ? user.image : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80' }}
              style={styles.avatar}
              contentFit="cover"
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Search & Filter Button Row */}
      <View style={styles.searchRow}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name="search" size={18} color={colors.textTertiary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search products..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            accessibilityLabel="Search products"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} accessibilityLabel="Clear search" style={styles.clearBtnWrap}>
              <Feather name="x" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            styles.filterBtn,
            { 
              backgroundColor: colors.surface, 
              borderColor: hasActiveFilters ? colors.primary : colors.border 
            }
          ]}
          onPress={handleOpenBottomSheet}
          activeOpacity={0.7}
          accessibilityLabel="Sort filters"
        >
          <Feather name="sliders" size={18} color={hasActiveFilters ? colors.primary : colors.textSecondary} />
          {activeFiltersCount > 0 ? (
            <View style={[styles.badge, { backgroundColor: colors.error }]}>
              <Text style={styles.badgeText}>{activeFiltersCount}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      {/* Premium Bottom Sheet Modal */}
      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFilters(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.bottomSheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {/* Drag Handle indicator */}
                <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />

                {/* Header */}
                <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.modalTitle, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
                    Sort & Filters
                  </Text>
                  <TouchableOpacity onPress={handleResetFilters} activeOpacity={0.7}>
                    <Text style={[styles.resetText, { color: colors.error, fontFamily: typography.fontFamily.bold }]}>
                      Reset
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Body Content */}
                <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                  {/* Sorting section */}
                  <Text style={[styles.filterGroupTitle, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
                    Sort By
                  </Text>
                  <View style={styles.optionsGrid}>
                    {[
                      { key: 'default', label: 'Default' },
                      { key: 'price-low', label: 'Price: Low to High' },
                      { key: 'price-high', label: 'Price: High to Low' },
                      { key: 'rating', label: 'Top Rated' },
                    ].map(opt => {
                      const isSelected = tempSortBy === opt.key;
                      return (
                        <TouchableOpacity
                          key={opt.key}
                          style={[
                            styles.optionPill,
                            { borderColor: isSelected ? colors.primary : colors.border },
                            isSelected && { backgroundColor: colors.primaryLight }
                          ]}
                          onPress={() => setTempSortBy(opt.key as any)}
                        >
                          <Text style={[styles.optionText, { 
                            color: isSelected ? colors.primary : colors.textSecondary,
                            fontFamily: isSelected ? typography.fontFamily.semibold : typography.fontFamily.regular
                          }]}>
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Price range section */}
                  <Text style={[styles.filterGroupTitle, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
                    Price Range
                  </Text>
                  <View style={styles.optionsGrid}>
                    {[
                      { key: 'all', label: 'All Prices' },
                      { key: 'under-500', label: 'Under ₹500' },
                      { key: '500-1000', label: '₹500 - ₹1000' },
                      { key: 'over-1000', label: 'Over ₹1000' },
                    ].map(opt => {
                      const isSelected = tempPriceRange === opt.key;
                      return (
                        <TouchableOpacity
                          key={opt.key}
                          style={[
                            styles.optionPill,
                            { borderColor: isSelected ? colors.primary : colors.border },
                            isSelected && { backgroundColor: colors.primaryLight }
                          ]}
                          onPress={() => setTempPriceRange(opt.key as any)}
                        >
                          <Text style={[styles.optionText, { 
                            color: isSelected ? colors.primary : colors.textSecondary,
                            fontFamily: isSelected ? typography.fontFamily.semibold : typography.fontFamily.regular
                          }]}>
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Customer Rating section */}
                  <Text style={[styles.filterGroupTitle, { color: colors.textPrimary, fontFamily: typography.fontFamily.bold }]}>
                    Customer Rating
                  </Text>
                  <View style={styles.optionsGrid}>
                    {[
                      { key: 'all', label: 'All Ratings' },
                      { key: '4.0', label: '4.0 ★ & Above' },
                      { key: '4.5', label: '4.5 ★ & Above' },
                    ].map(opt => {
                      const isSelected = tempRatingFilter === opt.key;
                      return (
                        <TouchableOpacity
                          key={opt.key}
                          style={[
                            styles.optionPill,
                            { borderColor: isSelected ? colors.primary : colors.border },
                            isSelected && { backgroundColor: colors.primaryLight }
                          ]}
                          onPress={() => setTempRatingFilter(opt.key as any)}
                        >
                          <Text style={[styles.optionText, { 
                            color: isSelected ? colors.primary : colors.textSecondary,
                            fontFamily: isSelected ? typography.fontFamily.semibold : typography.fontFamily.regular
                          }]}>
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>

                {/* Footer actions */}
                <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                  <Button
                    label="Apply Filters"
                    onPress={handleApplyFilters}
                    fullWidth
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Display Search Results list directly if searching, otherwise display Sliding Tab View */}
      {isSearching ? (
        isSearchLoading ? (
          <FlatList
            data={SKELETONS}
            keyExtractor={item => String(item)}
            numColumns={2}
            renderItem={() => <ProductCardSkeleton />}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        ) : isSearchError ? (
          <ErrorView
            message="Failed to load search results."
            onRetry={refetchSearch}
          />
        ) : (
          <FlatList
            data={sortedSearchProducts}
            renderItem={({ item }: { item: Product }) => (
              <ProductCard product={item} onPress={handleProductPress} />
            )}
            keyExtractor={(item: Product) => String(item.id)}
            numColumns={2}
            ListEmptyComponent={
              <EmptyState
                icon="🔍"
                title="No products found"
                message={`No results for "${debouncedSearch}"`}
              />
            }
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        <SharedTabView
          routes={routes}
          index={tabIndex}
          onIndexChange={setTabIndex}
          renderScene={renderScene}
          borderOnlyActive={true}
          activeBorderColor={colors.primary}
          inactiveBorderColor={colors.border}
          swipeEnabled={true}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerLogo: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
  },
  heading: {
    fontSize: typography.h2.fontSize,
  },
  subHeading: {
    fontSize: typography.caption.fontSize,
    marginTop: 2,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginLeft: spacing.md,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: 6,
    gap: spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    minHeight: 48,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '80%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: typography.h3.fontSize,
  },
  resetText: {
    fontSize: typography.body.fontSize,
  },
  modalContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  filterGroupTitle: {
    fontSize: typography.bodyLarge.fontSize,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  optionText: {
    fontSize: typography.caption.fontSize,
  },
  modalFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    fontSize: typography.bodyLarge.fontSize,
    fontFamily: typography.fontFamily.regular,
    paddingVertical: 8,
  },
  clearBtnWrap: { padding: 4 },
  chips: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: typography.body.fontSize,
    textTransform: 'capitalize',
  },
  list: { paddingHorizontal: spacing.sm, paddingTop: 6, paddingBottom: spacing.xxl },
});
