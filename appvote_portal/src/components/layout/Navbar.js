import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui';
import { theme } from '../../styles/theme';
import { useAuth } from '../../state/appContext';
import { useSupabase } from '../../services/SupabaseContext';

/**
 * PUBLIC_INTERFACE
 * Navbar component - Main navigation component with role-based links and responsive design
 * 
 * Displays different navigation options based on user authentication status and role:
 * - Guest users see: Home, Winners, Login, Register
 * - Authenticated users see: Home, Submit App, Winners, Logout
 * - Admin users additionally see: Admin Dashboard, Contest Management
 * 
 * Features active route highlighting and responsive mobile menu
 * 
 * @returns {JSX.Element} Rendered navbar component
 */
const Navbar = () => {
  const { state, send } = useAuth();
  const { isAdmin } = useSupabase();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Get authentication status from auth state machine
  const isAuthenticated = state.matches('authenticated');
  const userProfile = state.context.userProfile;
  
  // Check if admin role
  const userIsAdmin = isAdmin();
  
  // Handle scroll effect for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    send({ type: 'LOGOUT' });
    setMobileMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Check if route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Shared styles
  const styles = {
    navbar: {
      backgroundColor: theme.colors.background.paper,
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${theme.colors.border.light}`,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: '64px',
      boxSizing: 'border-box',
      zIndex: theme.zIndex.navbar,
      boxShadow: scrolled ? theme.shadows.md : 'none',
      transition: theme.transitions.default,
    },
    container: {
      maxWidth: theme.containers.lg,
      margin: '0 auto',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: theme.colors.text.primary,
      textDecoration: 'none',
    },
    logoSymbol: {
      color: theme.colors.primary.main,
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      '@media (max-width: 768px)': {
        display: 'none',
      }
    },
    navLink: {
      color: theme.colors.text.primary,
      textDecoration: 'none',
      fontWeight: theme.typography.fontWeight.medium,
      position: 'relative',
      padding: '4px 0',
      transition: theme.transitions.short,
      '&:hover': {
        color: theme.colors.primary.main,
      },
    },
    activeNavLink: {
      color: theme.colors.primary.main,
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-2px',
        left: 0,
        width: '100%',
        height: '2px',
        backgroundColor: theme.colors.primary.main,
        borderRadius: '1px',
      },
    },
    mobileMenuButton: {
      display: 'none',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      '@media (max-width: 768px)': {
        display: 'flex',
      }
    },
    mobileMenu: {
      position: 'fixed',
      top: '64px',
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background.paper,
      borderBottom: `1px solid ${theme.colors.border.light}`,
      boxShadow: theme.shadows.md,
      padding: '16px',
      display: 'none',
      flexDirection: 'column',
      gap: '16px',
      '@media (max-width: 768px)': {
        display: mobileMenuOpen ? 'flex' : 'none',
      }
    },
    mobileNavLink: {
      padding: '12px 0',
      borderBottom: `1px solid ${theme.colors.border.light}`,
      color: theme.colors.text.primary,
      textDecoration: 'none',
      fontWeight: theme.typography.fontWeight.medium,
    },
    mobileActiveLinkHint: {
      width: '4px',
      height: '100%',
      backgroundColor: theme.colors.primary.main,
      position: 'absolute',
      left: 0,
    },
    actionButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      '@media (max-width: 768px)': {
        display: 'none',
      }
    },
    welcomeText: {
      marginRight: '8px',
      color: theme.colors.text.secondary,
      '@media (max-width: 1024px)': {
        display: 'none',
      }
    },
    buttonWrapper: {
      '@media (max-width: 768px)': {
        width: '100%',
      }
    }
  };

  // Convert inline styles objects to handle pseudo-elements and media queries
  const getNavLinkStyle = (path) => {
    const baseStyle = {
      color: isActive(path) ? theme.colors.primary.main : theme.colors.text.primary,
      textDecoration: 'none',
      fontWeight: theme.typography.fontWeight.medium,
      position: 'relative',
      padding: '4px 0',
      transition: theme.transitions.short,
    };

    if (isActive(path)) {
      return {
        ...baseStyle,
        position: 'relative',
        '::after': {
          content: '""',
          position: 'absolute',
          bottom: '-2px',
          left: 0,
          width: '100%',
          height: '2px',
          backgroundColor: theme.colors.primary.main,
          borderRadius: '1px',
        }
      };
    }

    return baseStyle;
  };

  // Mobile menu burger button
  const MobileMenuButton = () => (
    <button
      onClick={toggleMobileMenu}
      aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      style={{
        display: 'none',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        '@media (max-width: 768px)': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '24px',
          height: '24px',
        }
      }}
    >
      <span style={{
        display: 'block',
        width: '24px',
        height: '2px',
        backgroundColor: theme.colors.text.primary,
        transition: theme.transitions.short,
        transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
      }}></span>
      <span style={{
        display: 'block',
        width: '24px',
        height: '2px',
        backgroundColor: theme.colors.text.primary,
        transition: theme.transitions.short,
        opacity: mobileMenuOpen ? 0 : 1,
      }}></span>
      <span style={{
        display: 'block',
        width: '24px',
        height: '2px',
        backgroundColor: theme.colors.text.primary,
        transition: theme.transitions.short,
        transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
      }}></span>
    </button>
  );

  return (
    <nav className="navbar" style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo} className="logo">
          <span className="logo-symbol" style={styles.logoSymbol}>*</span> AppVote Portal
        </Link>

        {/* Mobile Menu Button */}
        <div style={{ display: 'none', '@media (max-width: 768px)': { display: 'block' } }}>
          <button 
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <div style={{
              width: '24px',
              height: '3px',
              backgroundColor: theme.colors.text.primary,
              margin: '4px 0',
              transition: theme.transitions.short,
              transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
            }}></div>
            <div style={{
              width: '24px',
              height: '3px',
              backgroundColor: theme.colors.text.primary,
              margin: '4px 0',
              transition: theme.transitions.short,
              opacity: mobileMenuOpen ? 0 : 1
            }}></div>
            <div style={{
              width: '24px',
              height: '3px',
              backgroundColor: theme.colors.text.primary,
              margin: '4px 0',
              transition: theme.transitions.short,
              transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
            }}></div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          '@media (max-width: 768px)': { display: 'none' }
        }}>
          <div style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center'
          }}>
            {/* Links for all users */}
            <Link to="/" style={{
              ...styles.navLink,
              color: isActive('/') ? theme.colors.primary.main : theme.colors.text.primary,
              borderBottom: isActive('/') ? `2px solid ${theme.colors.primary.main}` : 'none',
              paddingBottom: '2px'
            }}>Home</Link>
            
            <Link to="/winners" style={{
              ...styles.navLink,
              color: isActive('/winners') ? theme.colors.primary.main : theme.colors.text.primary,
              borderBottom: isActive('/winners') ? `2px solid ${theme.colors.primary.main}` : 'none',
              paddingBottom: '2px'
            }}>Winners</Link>
            
            {/* Links for authenticated users */}
            {isAuthenticated && (
              <Link to="/submit-app" style={{
                ...styles.navLink,
                color: isActive('/submit-app') ? theme.colors.primary.main : theme.colors.text.primary,
                borderBottom: isActive('/submit-app') ? `2px solid ${theme.colors.primary.main}` : 'none',
                paddingBottom: '2px'
              }}>Add Your App</Link>
            )}
            
            {/* Links for admin users */}
            {isAuthenticated && userIsAdmin && (
              <>
                <Link to="/admin/dashboard" style={{
                  ...styles.navLink,
                  color: isActive('/admin/dashboard') ? theme.colors.primary.main : theme.colors.text.primary,
                  borderBottom: isActive('/admin/dashboard') ? `2px solid ${theme.colors.primary.main}` : 'none',
                  paddingBottom: '2px'
                }}>Admin Dashboard</Link>
                
                <Link to="/admin/contests" style={{
                  ...styles.navLink,
                  color: isActive('/admin/contests') ? theme.colors.primary.main : theme.colors.text.primary,
                  borderBottom: isActive('/admin/contests') ? `2px solid ${theme.colors.primary.main}` : 'none',
                  paddingBottom: '2px'
                }}>Contest Management</Link>
              </>
            )}
          </div>

          {/* Authentication buttons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <span style={{ 
                  marginRight: '8px', 
                  display: 'inline-block',
                  '@media (max-width: 1024px)': { display: 'none' }
                }}>
                  Welcome, {userProfile?.username || 'User'}
                </span>
                <Button variant="secondary" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="secondary">Login</Button>
                <Button as={Link} to="/register">Sign Up</Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            backgroundColor: theme.colors.background.paper,
            boxShadow: theme.shadows.md,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: theme.zIndex.navbar
          }}>
            {/* Mobile navigation links */}
            <Link to="/" style={{
              padding: '12px',
              borderRadius: theme.borderRadius.default,
              backgroundColor: isActive('/') ? theme.colors.background.highlight : 'transparent',
              color: isActive('/') ? theme.colors.primary.main : theme.colors.text.primary,
              textDecoration: 'none',
              fontWeight: theme.typography.fontWeight.medium
            }}>Home</Link>
            
            <Link to="/winners" style={{
              padding: '12px',
              borderRadius: theme.borderRadius.default,
              backgroundColor: isActive('/winners') ? theme.colors.background.highlight : 'transparent',
              color: isActive('/winners') ? theme.colors.primary.main : theme.colors.text.primary,
              textDecoration: 'none',
              fontWeight: theme.typography.fontWeight.medium
            }}>Winners</Link>
            
            {/* Links for authenticated users */}
            {isAuthenticated && (
              <Link to="/submit-app" style={{
                padding: '12px',
                borderRadius: theme.borderRadius.default,
                backgroundColor: isActive('/submit-app') ? theme.colors.background.highlight : 'transparent',
                color: isActive('/submit-app') ? theme.colors.primary.main : theme.colors.text.primary,
                textDecoration: 'none',
                fontWeight: theme.typography.fontWeight.medium
              }}>Add Your App</Link>
            )}
            
            {/* Links for admin users */}
            {isAuthenticated && userIsAdmin && (
              <>
                <Link to="/admin/dashboard" style={{
                  padding: '12px',
                  borderRadius: theme.borderRadius.default,
                  backgroundColor: isActive('/admin/dashboard') ? theme.colors.background.highlight : 'transparent',
                  color: isActive('/admin/dashboard') ? theme.colors.primary.main : theme.colors.text.primary,
                  textDecoration: 'none',
                  fontWeight: theme.typography.fontWeight.medium
                }}>Admin Dashboard</Link>
                
                <Link to="/admin/contests" style={{
                  padding: '12px',
                  borderRadius: theme.borderRadius.default,
                  backgroundColor: isActive('/admin/contests') ? theme.colors.background.highlight : 'transparent',
                  color: isActive('/admin/contests') ? theme.colors.primary.main : theme.colors.text.primary,
                  textDecoration: 'none',
                  fontWeight: theme.typography.fontWeight.medium
                }}>Contest Management</Link>
              </>
            )}
            
            {/* Authentication buttons */}
            <div style={{ 
              marginTop: '12px', 
              padding: '12px 0 0 0',
              borderTop: `1px solid ${theme.colors.border.light}`,
            }}>
              {isAuthenticated ? (
                <>
                  <div style={{ padding: '0 0 12px 12px' }}>
                    Signed in as <strong>{userProfile?.username || 'User'}</strong>
                  </div>
                  <Button fullWidth onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Button as={Link} to="/login" variant="secondary" fullWidth>Login</Button>
                  <Button as={Link} to="/register" fullWidth>Sign Up</Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
