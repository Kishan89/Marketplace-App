import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, CartItem } from '../types';
import { Product } from '../../products/types';

const initialState: CartState = {
  items: [],
  lastUpdated: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find(item => item.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      state.lastUpdated = Date.now();
    },

    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.product.id !== action.payload);
      state.lastUpdated = Date.now();
    },

    updateQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const { productId, quantity } = action.payload;
      const item = state.items.find(i => i.product.id === productId);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      state.lastUpdated = Date.now();
    },

    clearCart(state) {
      state.items = [];
      state.lastUpdated = Date.now();
    },

    // Hydrate cart from AsyncStorage on app start
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, hydrateCart } = cartSlice.actions;
export default cartSlice.reducer;
