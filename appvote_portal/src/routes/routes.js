import React from 'react';
import { Navigate } from 'react-router-dom';

// Import page components
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import SubmitApp from '../pages/SubmitApp';
import Winners from '../pages/Winners';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ContestManagement from '../pages/admin/ContestManagement';

// Import route protection components
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

/**
 * PUBLIC_INTERFACE
 * Public routes accessible to all users without authentication
 */
export const PUBLIC_ROUTES = [
  {
    path: '/',
    element: <Home />,
    exact: true
  },
  {
    path: '/login',
    element: <Login />,
    exact: true
  },
  {
    path: '/register',
    element: <Register />,
    exact: true
  },
  {
    path: '/winners',
    element: <Winners />,
    exact: true
  }
];

/**
 * PUBLIC_INTERFACE
 * Protected routes accessible only to authenticated users
 */
export const USER_PROTECTED_ROUTES = [
  {
    path: '/submit-app',
    element: (
      <ProtectedRoute>
        <SubmitApp />
      </ProtectedRoute>
    ),
    exact: true
  }
];

/**
 * PUBLIC_INTERFACE
 * Admin-only routes accessible only to users with admin role
 */
export const ADMIN_ROUTES = [
  {
    path: '/admin/dashboard',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
    exact: true
  },
  {
    path: '/admin/contests',
    element: (
      <AdminRoute>
        <ContestManagement />
      </AdminRoute>
    ),
    exact: true
  }
];

/**
 * PUBLIC_INTERFACE
 * All routes combined for use in the router
 */
export const ALL_ROUTES = [
  ...PUBLIC_ROUTES,
  ...USER_PROTECTED_ROUTES,
  ...ADMIN_ROUTES,
  // Catch-all redirect to home page
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];

/**
 * PUBLIC_INTERFACE
 * Helper function to get a route element by path
 */
export const getRouteByPath = (path) => {
  const route = ALL_ROUTES.find(route => route.path === path);
  return route ? route.element : null;
};
