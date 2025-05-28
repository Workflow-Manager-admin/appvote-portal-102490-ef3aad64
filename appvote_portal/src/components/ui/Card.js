import React from 'react';
import { theme } from '../../styles/theme';

/**
 * PUBLIC_INTERFACE
 * Card Component - Container component for displaying content in a styled box
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} [props.header] - Optional card header content
 * @param {React.ReactNode} [props.footer] - Optional card footer content
 * @param {string} [props.title] - Optional card title
 * @param {string} [props.subtitle] - Optional card subtitle
 * @param {boolean} [props.outlined=false] - Whether card should have an outline instead of shadow
 * @param {boolean} [props.hoverable=false] - Whether card should have hover effects
 * @param {string} [props.className] - Additional CSS class names
 * @param {object} [props.style] - Additional inline styles
 * @returns {JSX.Element} Card component
 */
const Card = ({
  children,
  header,
  footer,
  title,
  subtitle,
  outlined = false,
  hoverable = false,
  className = '',
  style = {},
  ...props
}) => {
  // Base card styles
  const cardStyles = {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.default,
    overflow: 'hidden',
    transition: theme.transitions.default,
    ...(outlined
      ? { border: `1px solid ${theme.colors.border.light}` }
      : { boxShadow: theme.shadows.md }),
    ...(hoverable && {
      cursor: 'pointer',
      '&:hover': {
        boxShadow: theme.shadows.lg,
        transform: 'translateY(-2px)',
      },
    }),
    ...style,
  };

  // Header styles
  const headerStyles = {
    padding: theme.spacing.lg,
    borderBottom: header ? `1px solid ${theme.colors.border.light}` : 'none',
  };

  // Content styles
  const contentStyles = {
    padding: theme.spacing.lg,
  };

  // Footer styles
  const footerStyles = {
    padding: theme.spacing.lg,
    borderTop: `1px solid ${theme.colors.border.light}`,
    backgroundColor: theme.colors.background.light,
  };

  // Title styles
  const titleStyles = {
    margin: 0,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeight.tight,
  };

  // Subtitle styles
  const subtitleStyles = {
    margin: subtitle ? `${theme.spacing.xs} 0 0 0` : 0,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.normal,
  };

  // Get class name
  const getCardClassName = () => {
    let classes = className ? className : '';
    
    // Add base class
    classes += ' app-card';
    
    // Add variant classes
    if (outlined) classes += ' app-card-outlined';
    if (hoverable) classes += ' app-card-hoverable';
    
    return classes.trim();
  };

  return (
    <div className={getCardClassName()} style={cardStyles} {...props}>
      {/* Render header if provided or if title exists */}
      {(header || title) && (
        <div className="app-card-header" style={headerStyles}>
          {header || (
            <>
              {title && <h3 style={titleStyles}>{title}</h3>}
              {subtitle && <div style={subtitleStyles}>{subtitle}</div>}
            </>
          )}
        </div>
      )}
      
      {/* Main content */}
      <div className="app-card-content" style={contentStyles}>
        {children}
      </div>
      
      {/* Render footer if provided */}
      {footer && (
        <div className="app-card-footer" style={footerStyles}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
