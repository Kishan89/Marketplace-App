import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../../features/products/screens/HomeScreen';
import { ProductDetailsScreen } from '../../features/products/screens/ProductDetailsScreen';
import { CartScreen } from '../../features/cart/screens/CartScreen';
import { CheckoutScreen } from '../../features/cart/screens/CheckoutScreen';
import { OrderSuccessScreen } from '../../features/cart/screens/OrderSuccessScreen';
import { ProfileScreen } from '../../features/auth/screens/ProfileScreen';
import { Colors } from '../../core/theme/colors';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { selectCartItemCount } from '../../features/cart/selectors';

export type HomeStackParamList = {
  ProductList: undefined;
  ProductDetails: { productId: number };
};

export type CartStackParamList = {
  CartList: undefined;
  Checkout: undefined;
  OrderSuccess: { orderId: string };
};

export type MainTabParamList = {
  HomeTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const CartStack = createNativeStackNavigator<CartStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const HomeStackNavigator: React.FC = () => (
  <HomeStack.Navigator
    screenOptions={{ headerShown: false }}
  >
    <HomeStack.Screen name="ProductList" component={HomeScreen} />
    <HomeStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </HomeStack.Navigator>
);

const CartStackNavigator: React.FC = () => (
  <CartStack.Navigator screenOptions={{ headerShown: false }}>
    <CartStack.Screen name="CartList" component={CartScreen} />
    <CartStack.Screen name="Checkout" component={CheckoutScreen} />
    <CartStack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
  </CartStack.Navigator>
);

const CartTabIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => {
  const count = useAppSelector(selectCartItemCount);
  return (
    <View>
      <Ionicons name="cart-outline" size={size} color={color} />
      {count > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      ) : null}
    </View>
  );
};

export const MainTabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.tabActive,
      tabBarInactiveTintColor: Colors.tabInactive,
      tabBarStyle: {
        backgroundColor: Colors.tabBackground,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        height: 60,
        paddingBottom: 8,
      },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
    }}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeStackNavigator}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="CartTab"
      component={CartStackNavigator}
      options={{
        tabBarLabel: 'Cart',
        tabBarIcon: ({ color, size }) => <CartTabIcon color={color} size={size} />,
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: Colors.badge,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
});
