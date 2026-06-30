import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User, LoginFormValues } from '../types';
import { ASYNC_STORAGE_KEYS } from '../../../core/constants/api';
import { logger } from '../../../shared/utils/logger';

// Dummy user for fake auth
const DUMMY_USER: User = {
  id: 1,
  username: 'kishan',
  email: 'test@marketplace.com',
  firstName: 'Kishan',
  lastName: 'Dev',
  image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
};

const DUMMY_TOKEN = 'marketplace-dummy-token-2024';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (_credentials: LoginFormValues, { rejectWithValue }) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Fake validation (any email + password ≥ 6 chars works)
      const token = DUMMY_TOKEN;
      const user = DUMMY_USER;

      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.AUTH_USER, JSON.stringify(user));

      return { token, user };
    } catch (err) {
      logger.error('Login failed', err);
      return rejectWithValue('Login failed. Please try again.');
    }
  },
);

export const restoreSessionThunk = createAsyncThunk('auth/restoreSession', async () => {
  const token = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN);
  const userStr = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.AUTH_USER);
  if (token && userStr) {
    return { token, user: JSON.parse(userStr) as User };
  }
  return null;
});

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN);
  await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.AUTH_USER);
});

const initialState: AuthState = {
  token: null,
  user: null,
  isLoading: false,
  isRestoring: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Login
    builder.addCase(loginThunk.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Restore session
    builder.addCase(restoreSessionThunk.pending, state => {
      state.isRestoring = true;
    });
    builder.addCase(restoreSessionThunk.fulfilled, (state, action) => {
      state.isRestoring = false;
      if (action.payload) {
        state.token = action.payload.token;
        state.user = action.payload.user;
      }
    });
    builder.addCase(restoreSessionThunk.rejected, state => {
      state.isRestoring = false;
    });

    // Logout
    builder.addCase(logoutThunk.fulfilled, state => {
      state.token = null;
      state.user = null;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
