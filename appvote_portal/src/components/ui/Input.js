import React, { useState } from 'react';
import { theme } from '../../styles/theme';

/**
 * PUBLIC_INTERFACE
 * Input Component - Reusable form input with validation and different states
 * 
 * @param {object} props - Component props
 * @param {string} props.id - Input id attribute
 * @param {string} props.name - Input name attribute
 * @param {'text'|'password'|'email'|'number'|'tel'|'url'|'search'} [props.type='text'] - Input type
 * @param {string} [props.label] - Input label
 * @param {string} [props.placeholder] - Input placeholder
 * @param {string} [props.value] - Input value
 * @param {Function} [props.onChange] - Change handler function
 * @param {Function} [props.onBlur] - Blur handler function
 * @param {boolean} [props.required=false] - Whether input is required
 * @param {boolean} [props.disabled=false] - Whether input is disabled
 * @param {boolean} [props.readOnly=false] - Whether input is read-only
 * @param {string} [props.error] - Error message to display
 * @param {string} [props.helperText] - Helper text to display below the input
 * @param {boolean} [props.fullWidth=true] - Whether input should take full width
 * @param {string} [props.className] - Additional CSS class names
 * @param {object} [props.style] - Additional inline styles
 * @returns {JSX.Element} Input component
 */
const Input = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  readOnly = false,
  error,
  helperText,
  fullWidth = true,
  className = '',
  style = {},
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  // Container styles
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing.md,
    width: fullWidth ? '100%' : 'auto',
    ...style,
  };

  // Label styles
  const labelStyles = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  };

  // Base input styles
  const inputStyles = {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.md,
    color: disabled ? theme.colors.text.disabled : theme.colors.text.primary,
    backgroundColor: disabled ? theme.colors.background.light : theme.colors.background.paper,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.default,
    border: `1px solid ${
      error 
        ? theme.colors.status.error
        : focused 
          ? theme.colors.primary.main 
          : theme.colors.border.main
    }`,
    outline: 'none',
    transition: theme.transitions.short,
    boxSizing: 'border-box',
    width: '100%',
  };

  // Helper text styles
  const helperTextStyles = {
    fontSize: theme.typography.fontSize.xs,
    color: error ? theme.colors.status.error : theme.colors.text.secondary,
    marginTop: theme.spacing.xxs,
  };

  // Handle focus events
  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  // Get input class name
  const getInputClassName = () => {
    let classes = className ? className : '';
    
    // Add base class
    classes += ' app-input';
    
    // Add state classes
    if (focused) classes += ' app-input-focused';
    if (error) classes += ' app-input-error';
    if (disabled) classes += ' app-input-disabled';
    if (readOnly) classes += ' app-input-readonly';
    
    return classes.trim();
  };

  return (
    <div className="app-input-container" style={containerStyles}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={id} 
          className="app-input-label" 
          style={labelStyles}
        >
          {label}
          {required && <span style={{ color: theme.colors.status.error }}> *</span>}
        </label>
      )}
      
      {/* Input element */}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        className={getInputClassName()}
        style={inputStyles}
        {...props}
      />
      
      {/* Error or helper text */}
      {(error || helperText) && (
        <div 
          className={error ? "app-input-error-text" : "app-input-helper-text"} 
          style={helperTextStyles}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default Input;
