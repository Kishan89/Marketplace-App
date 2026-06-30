import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { StyleSheet } from 'react-native';
import { store } from '../../store/store';
import { hydrateStoreFromStorage } from '../../store/store';
import { restoreSessionThunk } from '../../features/auth/slice/authSlice';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  useEffect(() => {
    // Hydrate cart + auth session from AsyncStorage on app start
    hydrateStoreFromStorage();
    store.dispatch(restoreSessionThunk());
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.flex}>
        <SafeAreaProvider>
          {children}
          <Toast />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
