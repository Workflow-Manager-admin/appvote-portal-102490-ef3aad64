import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// These environment variables should be set in your .env.local file during development
// and in your production environment for deployment
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

/**
 * PUBLIC_INTERFACE
 * Creates and exports a Supabase client instance for use throughout the application
 * @returns {object} Supabase client instance
 */
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * PUBLIC_INTERFACE
 * Utility function to check if the Supabase configuration is valid
 * @returns {boolean} True if the configuration is valid, false otherwise
 */
export const isSupabaseConfigured = () => {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
};

/**
 * PUBLIC_INTERFACE
 * Gets the current authenticated user from Supabase
 * @returns {Promise<object|null>} The current user or null if not authenticated
 */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export default supabase;
