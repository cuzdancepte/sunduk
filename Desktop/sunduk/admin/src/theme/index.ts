import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { typography } from './typography';
import { shadows } from './shadows';

// MUI tema konfigürasyonu - Figma UI Kit'ten uyarlanmış
export const theme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    warning: colors.warning,
    success: colors.success,
    info: colors.info,
    grey: colors.grey,
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    divider: colors.divider,
    action: colors.action,
  },
  
  typography: typography,
  
  shadows: shadows,
  
  shape: {
    borderRadius: 12, // Figma tasarımına uygun border radius
  },
  
  components: {
    // Button özelleştirmeleri
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(105, 73, 255, 0.2)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(105, 73, 255, 0.3)',
          },
        },
      },
    },
    
    // Card özelleştirmeleri
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    
    // TextField özelleştirmeleri
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover fieldset': {
              borderColor: colors.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
            },
          },
        },
      },
    },
    
    // Paper özelleştirmeleri
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    
    // AppBar özelleştirmeleri
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;

