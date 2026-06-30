import React, { useCallback, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  useWindowDimensions,
  TouchableOpacity,
  Text,
  ScrollView,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { TabView, TabBar, TabBarProps, Route } from 'react-native-tab-view';
import { useTheme } from '../../core/theme/ThemeContext';
import { typography } from '../../core/theme/typography';
import { spacing, radius } from '../../core/theme/spacing';

/**
 * Tab route configuration
 */
export interface TabRoute {
  key: string;
  title: string;
}

/**
 * Tab configuration type
 */
export interface TabConfig {
  key: string;
  title: string;
  component: ReactNode;
}

/**
 * Props for the TabView component
 */
export interface SharedTabViewProps {
  /** Array of tab routes */
  routes: TabRoute[];
  /** Current active tab index */
  index: number;
  /** Callback when tab changes */
  onIndexChange: (index: number) => void;
  /** Scene map for rendering tab content */
  renderScene?: (props: { route: TabRoute }) => ReactNode;
  /** Optional custom renderTabBar function */
  renderTabBar?: (props: any) => ReactNode;
  /** Enable/disable swipe gestures */
  swipeEnabled?: boolean;
  /** Enable/disable lazy loading */
  lazy?: boolean;
  /** Number of adjacent tabs to preload when lazy loading is enabled */
  lazyPreloadDistance?: number;
  /** Animation configuration */
  animationEnabled?: boolean;
  /** Container style */
  style?: ViewStyle;
  /** Tab bar container style */
  tabBarContainerStyle?: ViewStyle;
  /** Scrollable tab row content style */
  tabBarContentStyle?: ViewStyle;
  /** Tab bar style */
  tabBarStyle?: ViewStyle;
  /** Active tab indicator style */
  indicatorStyle?: ViewStyle;
  /** Active tab label style */
  activeLabelStyle?: TextStyle;
  /** Inactive tab label style */
  inactiveLabelStyle?: TextStyle;
  /** Custom tab bar press handler */
  onTabPress?: (scene: any) => void;
  /** Use border-only style for active tab (no fill) */
  borderOnlyActive?: boolean;
  /** Active tab border color */
  activeBorderColor?: string;
  /** Inactive tab border color */
  inactiveBorderColor?: string;
  /** Tab border width */
  borderWidth?: number;
  /** Show/hide bottom indicator line */
  showIndicator?: boolean;
  /** Render only the shared tab bar without pager scenes */
  tabOnly?: boolean;
  /** Stretch tabs to take up the full available width */
  fullWidth?: boolean;
}

/**
 * Custom Tab Bar with border-only active state
 */
interface CustomTabBarProps {
  navigationState: { index: number; routes: Route[] };
  position: Animated.AnimatedInterpolation<number>;
  borderOnlyActive?: boolean;
  activeBorderColor?: string;
  inactiveBorderColor?: string;
  borderWidth?: number;
  activeLabelStyle?: TextStyle;
  inactiveLabelStyle?: TextStyle;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  onTabPress?: (scene: { route: Route }) => void;
  jumpTo: (key: string) => void;
  fullWidth?: boolean;
}

const CustomTab = React.memo(({
  route,
  index,
  isActive,
  borderOnlyActive,
  activeBorderColor,
  inactiveBorderColor,
  borderWidth,
  activeLabelStyle,
  inactiveLabelStyle,
  onPress,
  onLayout,
  fullWidth,
}: {
  route: Route;
  index: number;
  isActive: boolean;
  borderOnlyActive: boolean;
  activeBorderColor: string;
  inactiveBorderColor: string;
  borderWidth: number;
  activeLabelStyle?: TextStyle;
  inactiveLabelStyle?: TextStyle;
  onPress: (route: Route) => void;
  onLayout: (index: number, event: LayoutChangeEvent) => void;
  fullWidth?: boolean;
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      key={route.key}
      activeOpacity={0.72}
      delayPressIn={0}
      delayPressOut={0}
      style={[
        styles.customTab,
        borderOnlyActive && {
          borderWidth: 1,
          borderColor: isActive ? activeBorderColor : inactiveBorderColor,
          backgroundColor: colors.surface,
        },
        !borderOnlyActive && isActive && {
          backgroundColor: activeBorderColor,
        },
        fullWidth && { flexGrow: 1, flexShrink: 0 },
      ]}
      onLayout={(event) => onLayout(index, event)}
      onPress={() => onPress(route)}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.customTabText,
          { color: isActive ? activeBorderColor : colors.textSecondary },
          isActive ? styles.activeCustomTabText : styles.inactiveCustomTabText,
          isActive && activeLabelStyle,
          !isActive && inactiveLabelStyle,
        ]}
      >
        {route.title}
      </Text>
    </TouchableOpacity>
  );
});

CustomTab.displayName = 'CustomTab';

const CustomTabBar: React.FC<CustomTabBarProps> = React.memo(({
  navigationState,
  borderOnlyActive = true,
  activeBorderColor,
  inactiveBorderColor,
  borderWidth = 1,
  activeLabelStyle,
  inactiveLabelStyle,
  containerStyle,
  contentStyle,
  onTabPress,
  jumpTo,
  fullWidth,
}) => {
  const { colors } = useTheme();
  const resolvedActiveBorderColor = activeBorderColor ?? colors.primary;
  const resolvedInactiveBorderColor = inactiveBorderColor ?? colors.border;
  const { routes, index: activeIndex } = navigationState;
  const scrollRef = useRef<ScrollView>(null);
  const tabLayouts = useRef<Record<number, { x: number; width: number }>>({});
  const [containerWidth, setContainerWidth] = useState(0);

  const scrollToActiveTab = useCallback(() => {
    const layout = tabLayouts.current[activeIndex];

    if (!layout || !containerWidth) {
      return;
    }

    const centeredOffset = Math.max(0, layout.x + layout.width / 2 - containerWidth / 2);
    scrollRef.current?.scrollTo({ x: centeredOffset, animated: true });
  }, [activeIndex, containerWidth]);

  useEffect(() => {
    const frame = requestAnimationFrame(scrollToActiveTab);
    return () => cancelAnimationFrame(frame);
  }, [scrollToActiveTab]);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    setContainerWidth((currentWidth) => currentWidth === nextWidth ? currentWidth : nextWidth);
  }, []);

  const handleTabLayout = useCallback((tabIndex: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    tabLayouts.current[tabIndex] = { x, width };

    if (tabIndex === activeIndex) {
      requestAnimationFrame(scrollToActiveTab);
    }
  }, [activeIndex, scrollToActiveTab]);

  const handleTabPress = useCallback((route: Route) => {
    jumpTo(route.key);
    requestAnimationFrame(() => onTabPress?.({ route }));
  }, [jumpTo, onTabPress]);

  return (
    <View style={StyleSheet.flatten([styles.customTabBarContainer, containerStyle])} onLayout={handleContainerLayout}>
      <ScrollView
        ref={scrollRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={StyleSheet.flatten([
          styles.customTabBarContent,
          fullWidth && { minWidth: '100%', justifyContent: 'space-between' },
          contentStyle
        ])}
      >
        {routes.map((route, i) => {
          const isActive = activeIndex === i;

          return (
            <CustomTab
              key={route.key}
              route={route}
              index={i}
              isActive={isActive}
              borderOnlyActive={borderOnlyActive}
              activeBorderColor={resolvedActiveBorderColor}
              inactiveBorderColor={resolvedInactiveBorderColor}
              borderWidth={borderWidth}
              activeLabelStyle={activeLabelStyle}
              inactiveLabelStyle={inactiveLabelStyle}
              onLayout={handleTabLayout}
              onPress={handleTabPress}
              fullWidth={fullWidth}
            />
          );
        })}
      </ScrollView>
    </View>
  );
});

CustomTabBar.displayName = 'CustomTabBar';

/**
 * Default tab bar renderer using react-native-tab-view's TabBar
 */
const DefaultTabBar = (props: TabBarProps<any>) => {
  const { colors } = useTheme();
  return (
    <TabBar
      {...props}
      indicatorStyle={StyleSheet.flatten([{ backgroundColor: colors.primary, height: 2 }, props.indicatorStyle])}
      style={StyleSheet.flatten([styles.tabBar, { borderBottomColor: colors.border }, props.style])}
      activeColor={colors.primary}
      inactiveColor={colors.textSecondary}
      pressColor={'transparent'}
      scrollEnabled={true}
    />
  );
};

/**
 * Shared UI TabView Component
 * 
 * A reusable tab view component with swipe support.
 * Can be used with custom tab bar or default tab bar.
 */
export const SharedTabView: React.FC<SharedTabViewProps> = ({
  routes,
  index,
  onIndexChange,
  renderScene,
  renderTabBar,
  swipeEnabled = true,
  lazy = true,
  lazyPreloadDistance = 1,
  animationEnabled = true,
  style,
  tabBarContainerStyle,
  tabBarContentStyle,
  tabBarStyle,
  indicatorStyle,
  onTabPress,
  borderOnlyActive = false,
  activeBorderColor,
  inactiveBorderColor,
  borderWidth = 2,
  showIndicator = true,
  activeLabelStyle,
  inactiveLabelStyle,
  tabOnly = false,
  fullWidth = false,
}) => {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const resolvedActiveBorderColor = activeBorderColor ?? colors.primary;
  const resolvedInactiveBorderColor = inactiveBorderColor ?? colors.border;
  const initialLayout = useMemo(() => ({ width }), [width]);
  const navigationState = useMemo(() => ({ index, routes }), [index, routes]);

  // Wrap renderScene to match TabView's expected signature
  const wrappedRenderScene = useCallback(
    (props: { route: any }) => renderScene?.({ route: props.route as TabRoute }) ?? null,
    [renderScene]
  );

  // Custom tab bar renderer
  const renderTabBarWrapper = useCallback(
    (props: any) => {
      if (renderTabBar) {
        return renderTabBar(props);
      }
      // Use custom border-only tab bar when enabled
      if (borderOnlyActive) {
        return (
          <CustomTabBar
            navigationState={props.navigationState}
            position={props.position}
            borderOnlyActive={borderOnlyActive}
            activeBorderColor={resolvedActiveBorderColor}
            inactiveBorderColor={resolvedInactiveBorderColor}
            borderWidth={borderWidth}
            activeLabelStyle={activeLabelStyle}
            inactiveLabelStyle={inactiveLabelStyle}
            containerStyle={tabBarContainerStyle}
            contentStyle={tabBarContentStyle}
            onTabPress={onTabPress}
            jumpTo={props.jumpTo}
            fullWidth={fullWidth}
          />
        );
      }
      return (
        <DefaultTabBar
          {...props}
          style={StyleSheet.flatten([styles.tabBar, tabBarStyle])}
          indicatorStyle={showIndicator ? StyleSheet.flatten([styles.indicator, indicatorStyle]) : { height: 0 }}
          onTabPress={onTabPress}
        />
      );
    },
    [renderTabBar, borderOnlyActive, activeBorderColor, inactiveBorderColor, borderWidth, showIndicator, tabBarContainerStyle, tabBarContentStyle, tabBarStyle, indicatorStyle, onTabPress, activeLabelStyle, inactiveLabelStyle]
  );

  if (tabOnly) {
    return (
      <CustomTabBar
        navigationState={navigationState}
        position={new Animated.Value(index) as any}
        borderOnlyActive={true}
        activeBorderColor={resolvedActiveBorderColor}
        inactiveBorderColor={resolvedInactiveBorderColor}
        borderWidth={borderWidth}
        activeLabelStyle={activeLabelStyle}
        inactiveLabelStyle={inactiveLabelStyle}
        containerStyle={tabBarContainerStyle}
        contentStyle={tabBarContentStyle}
        onTabPress={onTabPress}
        jumpTo={(key) => {
          const nextIndex = routes.findIndex((route) => route.key === key);
          if (nextIndex >= 0 && nextIndex !== index) {
            onIndexChange(nextIndex);
          }
        }}
        fullWidth={fullWidth}
      />
    );
  }

  return (
    <TabView
      navigationState={navigationState}
      renderScene={wrappedRenderScene}
      renderTabBar={renderTabBarWrapper as any}
      onIndexChange={onIndexChange}
      initialLayout={initialLayout}
      swipeEnabled={swipeEnabled}
      lazy={lazy}
      lazyPreloadDistance={lazyPreloadDistance}
      animationEnabled={animationEnabled}
      style={StyleSheet.flatten([styles.container, style])}
    />
  );
};

// Memoized version for performance
export const SharedTabViewMemo = React.memo(SharedTabView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'none',
  },
  // Custom border-only tab bar styles
  customTabBarContainer: {
    backgroundColor: 'transparent',
  },
  customTabBarContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 6, // Adjusted for exact equal spacing
    gap: 8,
  },
  customTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeCustomTabText: {},
  inactiveCustomTabText: {},
  indicator: {
    height: 2,
  },
});
