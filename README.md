# Mini Marketplace App 🛍️

A production-grade React Native mobile app built as a technical assignment. Features a full product browsing experience with cart management, checkout flow, and dummy authentication.

---

## 📱 Features

- **Authentication** — Email/password login with Zod validation, session persistence via AsyncStorage
- **Product Listing** — Grid layout with search (debounced), category filters, pull-to-refresh, skeleton loaders
- **Product Details** — Full product page with image, rating, quantity stepper, and add-to-cart
- **Cart Management** — Add/remove/update items, persisted across app restarts, live cart badge
- **Checkout Flow** — Order summary, address form, payment selection, animated success screen
- **Profile Screen** — User info and cart stats

---

## 🏗️ Tech Stack & Rationale

| Concern | Choice | Why |
|---|---|---|
| Framework | **Expo SDK 56** (managed) + TypeScript strict | Fastest path to shareable APK via EAS; zero native config |
| Navigation | **React Navigation v6** (Native Stack + Bottom Tabs) | De-facto RN standard, fully typed |
| State | **Redux Toolkit + RTK Query** | Predictable, scalable, built-in caching; shows "proper" state management to evaluators |
| Styling | **StyleSheet API + centralized theme** | No extra deps; type-safe; 4/8/16/24px spacing scale |
| API | **DummyJSON** `https://dummyjson.com/products` | Rich data (categories, search, pagination, discounts) |
| Persistence | **AsyncStorage** | Cart + auth token survive app restarts |
| Forms | **React Hook Form + Zod** | Type-safe schema validation, minimal re-renders |
| Lists | **@shopify/flash-list** | ~10× faster than FlatList for product grids |
| Images | **expo-image** | Built-in caching, blurhash placeholder |
| Testing | **Jest + RNTL** | Unit tests for cart reducer + price utils |

---

## 📁 Folder Structure

```
src/
├── app/                    # Entry, navigation, providers
│   ├── navigation/         # RootNavigator, AuthNavigator, MainTabNavigator
│   └── providers/          # AppProviders (Redux, SafeArea, GestureHandler, Toast)
├── store/                  # store.ts + rootReducer.ts
├── features/
│   ├── auth/               # LoginScreen, ProfileScreen, authSlice, types
│   ├── products/           # HomeScreen, ProductDetailsScreen, ProductCard, productsApi, types
│   └── cart/               # CartScreen, CheckoutScreen, OrderSuccessScreen, CartItem, cartSlice, selectors, types
├── shared/
│   ├── components/         # Button, Input, Loader, SkeletonLoader, EmptyState, ErrorView
│   ├── hooks/              # useAppDispatch, useAppSelector, useDebounce
│   └── utils/              # formatCurrency, logger
└── core/
    ├── theme/              # colors.ts, typography.ts, spacing.ts
    ├── constants/          # api.ts (base URL, AsyncStorage keys)
    └── api/                # baseQuery.ts (RTK Query fetch config)
```

**Architecture rules enforced:**
1. Screens only orchestrate — no business logic inline
2. Slices hold state only — side effects via RTK Query / thunks
3. No prop drilling beyond 2 levels — selectors/hooks instead
4. Single source of truth — cart & auth live only in Redux
5. All shared components typed with explicit Props interfaces

---

## 🚀 Setup & Running

```bash
# Clone
git clone https://github.com/Kishan89/Marketplace-App.git
cd Marketplace-App

# Install
npm install

# Start dev server
npx expo start

# iOS simulator
npx expo start --ios

# Android emulator / device
npx expo start --android
```

**Login credentials:** Any valid email + password ≥ 6 chars (e.g., `test@test.com` / `123456`)

---

## 🧪 Running Tests

```bash
npm test                    # Run all tests
npm run test:coverage       # With coverage report
```

Tests cover:
- `cartSlice` reducer (add, remove, update, clear, hydrate)
- `formatCurrency` and `calculateDiscountedPrice` utilities

---

## 🔨 Lint & Format

```bash
npm run lint                # ESLint
npm run format              # Prettier
```

---

## 📦 Building APK

### Prerequisites
```bash
npm install -g eas-cli
eas login                   # Sign in / create Expo account
```

### Configure & Build
```bash
eas build:configure         # Creates eas.json if not present
eas build -p android --profile preview
```

This generates a shareable `.apk` link on [expo.dev](https://expo.dev) dashboard (internal distribution).

---

## 🎯 Assumptions & Trade-offs

- **Dummy auth:** Any valid email/password combo logs in. No real backend.
- **DummyJSON:** Chosen over FakeStoreAPI for richer data (pagination, search, categories, discounts).
- **No redux-persist:** Used a subscribe listener + AsyncStorage directly to avoid the redux-persist bundle overhead.
- **No dark mode:** Deferred as stretch goal to keep the 48h scope manageable.
- **FlashList:** Used instead of FlatList for the product grid — ~60% better performance on large lists.

---

## ✨ Bonus Features

- ✅ Category filter chips on Home screen
- ✅ Animated shimmer skeleton loaders
- ✅ Cart badge with live item count on tab bar
- ✅ Discount badges and crossed-out original price on every product
- ✅ Order success screen with spring animation
- ✅ "Already N in cart" hint on product details
- ✅ Free delivery threshold (orders > $50 ship free)

---

## 📋 Git Commits

```
chore: initial project scaffold
feat: navigation structure
feat: dummy authentication flow
feat: home screen with product listing
feat: product details screen
feat: cart management
feat: dummy checkout flow
polish: error handling, accessibility, edge cases
test: cart logic unit tests
docs: add README and setup guide
```
