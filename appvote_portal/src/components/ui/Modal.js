import React, { useEffect, useRef } from 'react';
import { theme } from '../../styles/theme';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * Modal Component - Reusable dialog component for displaying content in a modal overlay
 * 
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal should close
 * @param {string} [props.title] - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} [props.footer] - Custom footer content
 * @param {boolean} [props.showCloseButton=true] - Whether to show the close button in the header
 * @param {string} [props.size='medium'] - Modal size ('small', 'medium', 'large', 'full')
 * @param {boolean} [props.closeOnBackdropClick=true] - Whether clicking the backdrop should close the modal
 * @param {boolean} [props.closeOnEsc=true] - Whether pressing ESC should close the modal
 * @param {string} [props.className] - Additional CSS class name for modal
 * @returns {JSX.Element|null} Modal component or null if not open
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
  size = 'medium',
  closeOnBackdropClick = true,
  closeOnEsc = true,
  className = '',
}) => {
  const modalRef = useRef(null);
  
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (closeOnEsc && event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose, closeOnEsc]);
  
  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Size mapping
  const sizeMap = {
    small: '400px',
    medium: '600px',
    large: '800px',
    full: '95%',
  };

  // Modal styles
  const styles = {
    backdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: theme.zIndex.modal,
      padding: theme.spacing.lg,
    },
    modal: {
      backgroundColor: theme.colors.background.paper,
      borderRadius: theme.borderRadius.default,
      boxShadow: theme.shadows.xl,
      width: sizeMap[size] || sizeMap.medium,
      maxWidth: '100%',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    header: {
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      borderBottom: `1px solid ${theme.colors.border.light}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      margin: 0,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    closeButton: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: '24px',
      lineHeight: '24px',
      color: theme.colors.text.secondary,
    },
    content: {
      padding: theme.spacing.lg,
      overflowY: 'auto',
    },
    footer: {
      padding: theme.spacing.md,
      borderTop: `1px solid ${theme.colors.border.light}`,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: theme.spacing.sm,
    },
  };
  
  // Don't render anything if modal is not open
  if (!isOpen) {
    return null;
  }

  // Get modal class name
  const getModalClassName = () => {
    let classes = className ? className : '';
    
    // Add base class
    classes += ' app-modal';
    
    // Add size class
    classes += ` app-modal-${size}`;
    
    return classes.trim();
  };
  
  return (
    <div 
      className="app-modal-backdrop"
      style={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div 
        ref={modalRef}
        className={getModalClassName()}
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div className="app-modal-header" style={styles.header}>
            {title && <h3 id="modal-title" style={styles.title}>{title}</h3>}
            {showCloseButton && (
              <button 
                className="app-modal-close-button" 
                style={styles.closeButton} 
                onClick={onClose}
                aria-label="Close"
                type="button"
              >
                &times;
              </button>
            )}
          </div>
        )}
        
        {/* Modal Content */}
        <div className="app-modal-content" style={styles.content}>
          {children}
        </div>
        
        {/* Modal Footer */}
        {footer && (
          <div className="app-modal-footer" style={styles.footer}>
            {footer}
          </div>
        )}
        
        {/* Default Footer (if no custom footer is provided, but we want default buttons) */}
        {!footer && (
          <div className="app-modal-footer" style={styles.footer}>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>OK</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
