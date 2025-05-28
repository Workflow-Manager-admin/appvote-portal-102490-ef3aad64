/**
 * Global design tokens and theme variables for AppVote Portal
 * This centralized theme system ensures consistency across components
 */

export const theme = {
  colors: {
    // Primary colors (blue shades)
    primary: {
      main: '#1976D2',      // Main primary color
      light: '#42a5f5',     // Lighter variant
      dark: '#1565C0',      // Darker variant
      hover: '#1669BB',     // Hover state
      active: '#0d47a1',    // Active/pressed state
      focus: 'rgba(25, 118, 210, 0.4)', // Focus ring
      100: '#bbdefb',       // Very light blue (for backgrounds)
      200: '#90caf9',       // Light blue
      300: '#64b5f6',       // Moderate light blue
      400: '#42a5f5',       // Slightly light blue
      500: '#1976D2',       // Main blue
      600: '#1565C0',       // Slightly dark blue
      700: '#0d47a1',       // Moderate dark blue
      800: '#0a3880',       // Dark blue
      900: '#072a60',       // Very dark blue
    },
    // Background and text colors (white/gray shades)
    background: {
      paper: '#FFFFFF',     // Pure white
      default: '#F5F7FA',   // Off-white for main background
      light: '#FAFBFC',     // Very light gray
      highlight: '#EEF2F6', // Slightly blue-tinted highlight
    },
    text: {
      primary: '#1A2027',   // Near black for primary text
      secondary: '#4B5563', // Dark gray for secondary text
      disabled: '#9CA3AF',  // Medium gray for disabled text
      hint: '#6B7280',      // Light gray for hint text
      inverse: '#FFFFFF',   // White text for dark backgrounds
    },
    // Status colors
    status: {
      success: '#4CAF50',   // Green
      warning: '#FF9800',   // Orange
      error: '#F44336',     // Red
      info: '#2196F3',      // Info blue
    },
    // Border and divider colors
    border: {
      light: '#E5E7EB',     // Light gray
      main: '#D1D5DB',      // Medium gray
      dark: '#9CA3AF',      // Dark gray
    },
  },
  
  // Spacing scale (in px)
  spacing: {
    xxs: '4px',
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  
  // Typography styles
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      md: '1rem',       // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      xxl: '1.5rem',    // 24px
      xxxl: '2rem',     // 32px
      display: '3rem',  // 48px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    heading: {
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        lineHeight: 1.2,
        marginBottom: '0.5em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.25,
        marginBottom: '0.5em',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.3,
        marginBottom: '0.5em',
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
        marginBottom: '0.5em',
      },
      h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
        marginBottom: '0.5em',
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.4,
        marginBottom: '0.5em',
      },
    },
  },
  
  // Border radius
  borderRadius: {
    small: '4px',
    default: '8px',
    large: '12px',
    xl: '16px',
    pill: '9999px',
    circle: '50%',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    focus: '0 0 0 3px rgba(25, 118, 210, 0.4)',
  },
  
  // Z-index scale
  zIndex: {
    navbar: 100,
    dropdown: 200,
    modal: 300,
    tooltip: 400,
  },
  
  // Transitions
  transitions: {
    short: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    default: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    long: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Container widths
  containers: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  }
};

export default theme;
