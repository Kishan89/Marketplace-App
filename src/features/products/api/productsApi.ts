import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../../core/api/baseQuery';
import { Product, ProductsResponse, Category } from '../types';
import { PRODUCTS_LIMIT } from '../../../core/constants/api';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery,
  tagTypes: ['Products', 'Product'],
  endpoints: builder => ({
    getProducts: builder.query<ProductsResponse, { skip?: number; limit?: number; category?: string }>({
      query: ({ skip = 0, limit = PRODUCTS_LIMIT, category }) =>
        category
          ? `/products/category/${category}?skip=${skip}&limit=${limit}`
          : `/products?skip=${skip}&limit=${limit}`,
      providesTags: ['Products'],
    }),
    getProductById: builder.query<Product, number>({
      query: id => `/products/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Product', id }],
    }),
    searchProducts: builder.query<ProductsResponse, string>({
      query: q => `/products/search?q=${encodeURIComponent(q)}&limit=${PRODUCTS_LIMIT}`,
    }),
    getCategories: builder.query<Category[], void>({
      query: () => '/products/categories',
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useGetCategoriesQuery,
} = productsApi;
