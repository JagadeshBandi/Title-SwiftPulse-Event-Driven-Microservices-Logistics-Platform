import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea', // Modern purple
      light: '#8b9aff',
      dark: '#4c63d2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f56565', // Coral red
      light: '#fc8181',
      dark: '#e53e3e',
      contrastText: '#ffffff',
    },
    success: {
      main: '#48bb78', // Green
      light: '#68d391',
      dark: '#38a169',
    },
    warning: {
      main: '#ed8936', // Orange
      light: '#f6ad55',
      dark: '#dd6b20',
    },
    error: {
      main: '#f56565', // Red
      light: '#fc8181',
      dark: '#e53e3e',
    },
    info: {
      main: '#4299e1', // Blue
      light: '#63b3ed',
      dark: '#3182ce',
    },
    background: {
      default: '#f7fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#718096',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 800,
      lineHeight: 1.2,
      color: '#1a202c',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      color: '#2d3748',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#2d3748',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#2d3748',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#2d3748',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#2d3748',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#4a5568',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#718096',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#718096',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#718096',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
      color: '#a0aec0',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#718096',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.1),0px 1px 1px 0px rgba(0,0,0,0.07),0px 1px 3px 0px rgba(0,0,0,0.06)',
    '0px 3px 1px -2px rgba(0,0,0,0.1),0px 2px 2px 0px rgba(0,0,0,0.07),0px 1px 5px 0px rgba(0,0,0,0.06)',
    '0px 3px 3px -2px rgba(0,0,0,0.1),0px 3px 4px 0px rgba(0,0,0,0.07),0px 1px 8px 0px rgba(0,0,0,0.06)',
    '0px 2px 4px -1px rgba(0,0,0,0.1),0px 4px 5px 0px rgba(0,0,0,0.07),0px 1px 10px 0px rgba(0,0,0,0.06)',
    '0px 3px 5px -1px rgba(0,0,0,0.1),0px 5px 8px 0px rgba(0,0,0,0.07),0px 1px 14px 0px rgba(0,0,0,0.06)',
    '0px 3px 5px -1px rgba(0,0,0,0.1),0px 6px 10px 0px rgba(0,0,0,0.07),0px 1px 18px 0px rgba(0,0,0,0.06)',
    '0px 4px 8px -2px rgba(0,0,0,0.1),0px 7px 12px 1px rgba(0,0,0,0.07),0px 2px 20px 1px rgba(0,0,0,0.06)',
    '0px 5px 10px -3px rgba(0,0,0,0.1),0px 8px 16px 1px rgba(0,0,0,0.07),0px 3px 24px 2px rgba(0,0,0,0.06)',
    '0px 5px 15px -3px rgba(0,0,0,0.1),0px 9px 20px 1px rgba(0,0,0,0.07),0px 3px 28px 2px rgba(0,0,0,0.06)',
    '0px 6px 20px -3px rgba(0,0,0,0.1),0px 10px 25px 1px rgba(0,0,0,0.07),0px 4px 32px 3px rgba(0,0,0,0.06)',
    '0px 7px 25px -3px rgba(0,0,0,0.1),0px 12px 30px 1px rgba(0,0,0,0.07),0px 5px 36px 3px rgba(0,0,0,0.06)',
    '0px 8px 30px -3px rgba(0,0,0,0.1),0px 14px 35px 1px rgba(0,0,0,0.07),0px 6px 40px 4px rgba(0,0,0,0.06)',
    '0px 9px 35px -3px rgba(0,0,0,0.1),0px 16px 40px 1px rgba(0,0,0,0.07),0px 7px 44px 4px rgba(0,0,0,0.06)',
    '0px 10px 40px -3px rgba(0,0,0,0.1),0px 18px 45px 1px rgba(0,0,0,0.07),0px 8px 48px 5px rgba(0,0,0,0.06)',
    '0px 11px 45px -4px rgba(0,0,0,0.1),0px 20px 50px 1px rgba(0,0,0,0.07),0px 9px 52px 5px rgba(0,0,0,0.06)',
    '0px 12px 50px -4px rgba(0,0,0,0.1),0px 22px 55px 1px rgba(0,0,0,0.07),0px 10px 56px 6px rgba(0,0,0,0.06)',
    '0px 13px 55px -4px rgba(0,0,0,0.1),0px 24px 60px 1px rgba(0,0,0,0.07),0px 11px 60px 6px rgba(0,0,0,0.06)',
    '0px 14px 60px -4px rgba(0,0,0,0.1),0px 26px 65px 1px rgba(0,0,0,0.07),0px 12px 64px 7px rgba(0,0,0,0.06)',
    '0px 15px 65px -4px rgba(0,0,0,0.1),0px 28px 70px 1px rgba(0,0,0,0.07),0px 13px 68px 7px rgba(0,0,0,0.06)',
    '0px 16px 70px -4px rgba(0,0,0,0.1),0px 30px 75px 1px rgba(0,0,0,0.07),0px 14px 72px 7px rgba(0,0,0,0.06)',
    '0px 17px 75px -4px rgba(0,0,0,0.1),0px 32px 80px 1px rgba(0,0,0,0.07),0px 15px 76px 8px rgba(0,0,0,0.06)',
    '0px 18px 80px -4px rgba(0,0,0,0.1),0px 34px 85px 1px rgba(0,0,0,0.07),0px 16px 80px 8px rgba(0,0,0,0.06)',
    '0px 19px 85px -4px rgba(0,0,0,0.1),0px 36px 90px 1px rgba(0,0,0,0.07),0px 17px 84px 8px rgba(0,0,0,0.06)',
    '0px 20px 90px -4px rgba(0,0,0,0.1),0px 38px 95px 1px rgba(0,0,0,0.07),0px 18px 88px 9px rgba(0,0,0,0.06)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 28px',
          fontSize: '0.9rem',
          borderRadius: 12,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #f56565 0%, #ed8936 100%)',
          boxShadow: '0 4px 15px rgba(245, 101, 101, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #e53e3e 0%, #dd6b20 100%)',
            boxShadow: '0 8px 25px rgba(245, 101, 101, 0.5)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        },
        elevation3: {
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#667eea',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#667eea',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.2)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '8px 16px',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            transform: 'translateX(4px)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(102, 126, 234, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(102, 126, 234, 0.2)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          minHeight: 48,
        },
      },
    },
  },
});

export default theme;
