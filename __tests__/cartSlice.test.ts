import cartReducer, {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  hydrateCart,
} from '../../src/features/cart/slice/cartSlice';
import { CartState } from '../../src/features/cart/types';
import { Product } from '../../src/features/products/types';

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  description: 'A test product',
  price: 100,
  discountPercentage: 10,
  rating: 4.5,
  stock: 50,
  brand: 'TestBrand',
  category: 'electronics',
  thumbnail: 'https://example.com/img.jpg',
  images: [],
};

const mockProduct2: Product = { ...mockProduct, id: 2, title: 'Second Product' };

const initialState: CartState = { items: [], lastUpdated: 0 };

describe('cartSlice reducer', () => {
  it('should return initial state', () => {
    expect(cartReducer(undefined, { type: '@@INIT' })).toMatchObject({ items: [] });
  });

  it('addItem: adds a new item with quantity 1', () => {
    const state = cartReducer(initialState, addItem({ product: mockProduct }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].product.id).toBe(1);
    expect(state.items[0].quantity).toBe(1);
  });

  it('addItem: increments quantity for existing item', () => {
    let state = cartReducer(initialState, addItem({ product: mockProduct }));
    state = cartReducer(state, addItem({ product: mockProduct, quantity: 2 }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('addItem: adds multiple distinct products', () => {
    let state = cartReducer(initialState, addItem({ product: mockProduct }));
    state = cartReducer(state, addItem({ product: mockProduct2 }));
    expect(state.items).toHaveLength(2);
  });

  it('removeItem: removes the correct item', () => {
    let state = cartReducer(initialState, addItem({ product: mockProduct }));
    state = cartReducer(state, addItem({ product: mockProduct2 }));
    state = cartReducer(state, removeItem(1));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].product.id).toBe(2);
  });

  it('removeItem: does nothing if item not in cart', () => {
    const state = cartReducer(initialState, removeItem(999));
    expect(state.items).toHaveLength(0);
  });

  it('updateQuantity: updates quantity for existing item', () => {
    let state = cartReducer(initialState, addItem({ product: mockProduct }));
    state = cartReducer(state, updateQuantity({ productId: 1, quantity: 5 }));
    expect(state.items[0].quantity).toBe(5);
  });

  it('updateQuantity: clamps quantity to minimum 1', () => {
    let state = cartReducer(initialState, addItem({ product: mockProduct }));
    state = cartReducer(state, updateQuantity({ productId: 1, quantity: 0 }));
    expect(state.items[0].quantity).toBe(1);
    state = cartReducer(state, updateQuantity({ productId: 1, quantity: -5 }));
    expect(state.items[0].quantity).toBe(1);
  });

  it('clearCart: removes all items', () => {
    let state = cartReducer(initialState, addItem({ product: mockProduct }));
    state = cartReducer(state, addItem({ product: mockProduct2 }));
    state = cartReducer(state, clearCart());
    expect(state.items).toHaveLength(0);
  });

  it('hydrateCart: sets items from storage', () => {
    const hydratedItems = [{ product: mockProduct, quantity: 3 }];
    const state = cartReducer(initialState, hydrateCart(hydratedItems));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });
});
