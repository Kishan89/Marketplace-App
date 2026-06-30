import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from './rootReducer';
import { productsApi } from '../features/products/api/productsApi';
import { hydrateCart } from '../features/cart/slice/cartSlice';
import { ASYNC_STORAGE_KEYS } from '../core/constants/api';
import { CartItem } from '../features/cart/types';
import { logger } from '../shared/utils/logger';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['cart/hydrateCart'],
      },
    }).concat(productsApi.middleware),
});

// Persist cart to AsyncStorage on every state change
let prevCartLastUpdated = 0;
store.subscribe(() => {
  const state = store.getState();
  const { lastUpdated, items } = state.cart;
  if (lastUpdated !== prevCartLastUpdated) {
    prevCartLastUpdated = lastUpdated;
    AsyncStorage.setItem(ASYNC_STORAGE_KEYS.CART, JSON.stringify(items)).catch(err =>
      logger.error('Cart persist failed', err),
    );
  }
});

// Hydrate cart from AsyncStorage when store is created
export const hydrateStoreFromStorage = async () => {
  try {
    const cartStr = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.CART);
    if (cartStr) {
      const items = JSON.parse(cartStr) as CartItem[];
      store.dispatch(hydrateCart(items));
    }
  } catch (err) {
    logger.error('Cart hydration failed', err);
  }
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
