import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../store/store';
import { calculateDiscountedPrice } from '../../../shared/utils/formatCurrency';

const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = createSelector(selectCartState, cart => cart.items);

export const selectCartItemCount = createSelector(selectCartItems, items =>
  items.reduce((total, item) => total + item.quantity, 0),
);

export const selectCartTotal = createSelector(selectCartItems, items =>
  items.reduce((total, item) => {
    const discounted = calculateDiscountedPrice(
      item.product.price,
      item.product.discountPercentage,
    );
    return total + discounted * item.quantity;
  }, 0),
);

export const selectItemById = (productId: number) =>
  createSelector(selectCartItems, items => items.find(item => item.product.id === productId));
