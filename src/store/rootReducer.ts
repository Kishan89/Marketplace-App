import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slice/authSlice';
import cartReducer from '../features/cart/slice/cartSlice';
import { productsApi } from '../features/products/api/productsApi';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  [productsApi.reducerPath]: productsApi.reducer,
});

export default rootReducer;
export type RootReducer = ReturnType<typeof rootReducer>;
