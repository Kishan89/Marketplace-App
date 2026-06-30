import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../../core/api/baseQuery';
import { Product, ProductsResponse, Category } from '../types';
import { PRODUCTS_LIMIT } from '../../../core/constants/api';

const USD_TO_INR_RATE = 83;

const transformProduct = (product: Product): Product => ({
  ...product,
  price: Math.round(product.price * USD_TO_INR_RATE * 100) / 100,
});

const transformProductsResponse = (response: ProductsResponse): ProductsResponse => ({
  ...response,
  products: response.products.map(transformProduct),
});

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
      transformResponse: transformProductsResponse,
    }),
    getProductById: builder.query<Product, number>({
      query: id => `/products/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Product', id }],
      transformResponse: transformProduct,
    }),
    searchProducts: builder.query<ProductsResponse, string>({
      query: q => `/products/search?q=${encodeURIComponent(q)}&limit=${PRODUCTS_LIMIT}`,
      transformResponse: transformProductsResponse,
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
