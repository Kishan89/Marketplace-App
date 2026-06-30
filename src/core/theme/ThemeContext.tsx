import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeColors, lightColors, darkColors } from './colors';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = '@theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('light');

  useEffect(() => {
    const loadPersistedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeState(savedTheme);
        } else if (systemScheme === 'dark' || systemScheme === 'light') {
          setThemeState(systemScheme);
        }
      } catch (e) {
        console.warn('Failed to load theme preference', e);
      }
    };
    loadPersistedTheme();
  }, [systemScheme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    // Non-blocking fire-and-forget storage update to eliminate state transition delay
    AsyncStorage.setItem(THEME_KEY, mode).catch(e => {
      console.warn('Failed to persist theme preference', e);
    });
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const activeColors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: activeColors,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
