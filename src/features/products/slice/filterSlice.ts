import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  sortBy: 'default' | 'price-low' | 'price-high' | 'rating';
  priceRange: 'all' | 'under-500' | '500-1000' | 'over-1000';
  ratingFilter: 'all' | '4.0' | '4.5';
}

const initialState: FilterState = {
  sortBy: 'default',
  priceRange: 'all',
  ratingFilter: 'all',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<FilterState>) {
      state.sortBy = action.payload.sortBy;
      state.priceRange = action.payload.priceRange;
      state.ratingFilter = action.payload.ratingFilter;
    },
    resetFilters(state) {
      state.sortBy = 'default';
      state.priceRange = 'all';
      state.ratingFilter = 'all';
    },
  },
});

export const { setFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
