import { useContext, createContext } from 'react';
import theme from './index';
import { Theme } from './index';

const ThemeContext = createContext<Theme>(theme);

export const ThemeProvider = ThemeContext.Provider;

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  return context || theme;
};

export default useTheme;

