import React from 'react';
import {
  useFonts,
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
  Figtree_800ExtraBold,
} from '@expo-google-fonts/figtree';
import { AppProviders } from './src/app/providers/AppProviders';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { Loader } from './src/shared/components/Loader';
import { ThemeProvider } from './src/core/theme/ThemeContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
    Figtree_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <ThemeProvider>
        <Loader />
      </ThemeProvider>
    );
  }

  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
