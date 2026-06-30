import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slice/authSlice';
import cartReducer from '../features/cart/slice/cartSlice';
import filterReducer from '../features/products/slice/filterSlice';
import { productsApi } from '../features/products/api/productsApi';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  filters: filterReducer,
  [productsApi.reducerPath]: productsApi.reducer,
});

export default rootReducer;
export type RootReducer = ReturnType<typeof rootReducer>;
