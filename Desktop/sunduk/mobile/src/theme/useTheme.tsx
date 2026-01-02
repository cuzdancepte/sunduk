import React, { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme, { Theme } from './index';
import { colors as lightColors } from './colors';

// Dark mode renkleri
const darkColors = {
  ...lightColors,
  background: {
    default: '#181a20',
    paper: '#1f222a',
    light: '#212121',
    dark: '#181a20',
    darkSecondary: '#1f222a',
    darkTertiary: '#212121',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
    disabled: '#666666',
    hint: '#9e9e9e',
    white: '#ffffff',
  },
  border: {
    light: '#2a2d35',
    medium: '#333640',
    dark: '#3d4048',
  },
};

const createTheme = (isDark: boolean): Theme => ({
  ...theme,
  colors: isDark ? darkColors : lightColors,
});

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // AsyncStorage'dan dark mode durumunu yükle
    AsyncStorage.getItem('darkMode')
      .then((value) => {
        if (value !== null) {
          setIsDarkMode(value === 'true');
        }
      })
      .catch(() => {
        setIsDarkMode(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    try {
      await AsyncStorage.setItem('darkMode', String(newValue));
    } catch (error) {
      console.error('Error saving dark mode:', error);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: createTheme(isDarkMode),
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    return theme;
  }
  return context.theme;
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};

export default useTheme;
