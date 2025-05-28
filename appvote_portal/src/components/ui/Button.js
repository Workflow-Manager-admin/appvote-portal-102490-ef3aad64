import React from 'react';
import { theme } from '../../styles/theme';

/**
 * PUBLIC_INTERFACE
 * Button Component - Reusable button with different variants and sizes
 * 
 * @param {object} props - Component props
 * @param {'primary'|'secondary'|'outline'|'text'} [props.variant='primary'] - Button variant
 * @param {'small'|'medium'|'large'} [props.size='medium'] - Button size
 * @param {Function} props.onClick - Click handler function
 * @param {boolean} [props.fullWidth=false] - Whether button should take up full width
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.type='button'] - Button type attribute
 * @param {string} [props.className] - Additional CSS class names
 * @returns {JSX.Element} Button component
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  onClick,
  fullWidth = false,
  disabled = false,
  children,
  type = 'button',
  className = '',
  as: Component = 'button',
  ...props
}) => {
  // Base button styles
  const buttonStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeight.medium,
    borderRadius: theme.borderRadius.default,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: theme.transitions.default,
    border: 'none',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.7 : 1,
  };

  // Size specific styles
  const sizeStyles = {
    small: {
      fontSize: theme.typography.fontSize.sm,
      padding: `${theme.spacing.xxs} ${theme.spacing.sm}`,
      height: '32px',
    },
    medium: {
      fontSize: theme.typography.fontSize.md,
      padding: `${theme.spacing.xs} ${theme.spacing.md}`,
      height: '40px',
    },
    large: {
      fontSize: theme.typography.fontSize.lg,
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      height: '48px',
    },
  };

  // Variant specific styles
  const variantStyles = {
    primary: {
      backgroundColor: disabled ? theme.colors.border.main : theme.colors.primary.main,
      color: theme.colors.text.inverse,
      '&:hover': {
        backgroundColor: theme.colors.primary.hover,
      },
      '&:active': {
        backgroundColor: theme.colors.primary.active,
      },
    },
    secondary: {
      backgroundColor: theme.colors.background.light,
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.border.main}`,
      '&:hover': {
        backgroundColor: theme.colors.background.highlight,
      },
      '&:active': {
        backgroundColor: theme.colors.border.light,
      },
    },
    outline: {
      backgroundColor: 'transparent',
      color: theme.colors.primary.main,
      border: `1px solid ${theme.colors.primary.main}`,
      '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.08)',
      },
      '&:active': {
        backgroundColor: 'rgba(25, 118, 210, 0.16)',
      },
    },
    text: {
      backgroundColor: 'transparent',
      color: theme.colors.primary.main,
      padding: '0',
      '&:hover': {
        backgroundColor: 'transparent',
        textDecoration: 'underline',
      },
    },
  };

  // Get styles based on variant and size
  const currentSizeStyles = sizeStyles[size] || sizeStyles.medium;
  const currentVariantStyles = variantStyles[variant] || variantStyles.primary;

  // Combined styles
  const combinedStyles = {
    ...buttonStyles,
    ...currentSizeStyles,
    ...currentVariantStyles,
  };

  // Utility function to convert styles object to CSS string
  const cssFromObject = (styles) => {
    return Object.entries(styles).map(([key, value]) => {
      const camelToKebab = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      return `${camelToKebab}: ${value};`;
    }).join(' ');
  };

  // Handle hover states with classes
  const getButtonClassName = () => {
    let classes = className ? className : '';
    
    // Add base class
    classes += ' app-btn';
    
    // Add variant class
    classes += ` app-btn-${variant}`;
    
    // Add size class
    classes += ` app-btn-${size}`;
    
    // Add fullWidth class if needed
    if (fullWidth) {
      classes += ' app-btn-full-width';
    }
    
    return classes.trim();
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={getButtonClassName()}
      style={combinedStyles}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
