/**
 * Routes index file
 * Exports all routing-related components and configurations for easy importing
 */

import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import { 
  PUBLIC_ROUTES, 
  USER_PROTECTED_ROUTES, 
  ADMIN_ROUTES, 
  ALL_ROUTES,
  getRouteByPath
} from './routes';

export {
  ProtectedRoute,
  AdminRoute,
  PUBLIC_ROUTES,
  USER_PROTECTED_ROUTES,
  ADMIN_ROUTES,
  ALL_ROUTES,
  getRouteByPath
};
