import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase, { isSupabaseConfigured } from './supabase';

// Create the context
const SupabaseContext = createContext(null);

/**
 * Supabase context provider component to manage auth state and provide the Supabase client
 * throughout the application
 */
export const SupabaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(null);

  useEffect(() => {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      setConfigError('Supabase configuration is missing. Please check your environment variables.');
      setLoading(false);
      return;
    }

    // Get the initial session
    const fetchInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleAuthStateChange(session?.user || null);
      setLoading(false);
      
      // Set up auth state change listener
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        (_event, session) => {
          handleAuthStateChange(session?.user || null);
        }
      );

      return () => {
        subscription?.unsubscribe();
      };
    };

    fetchInitialSession();
  }, []);

  // Handle auth state changes and fetch user profile data
  const handleAuthStateChange = async (user) => {
    setUser(user);
    
    if (user) {
      // Fetch additional user profile data from the users table
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setUserProfile(profile);
    } else {
      setUserProfile(null);
    }
  };

  // Sign up new user
  const signUp = async (email, password, username) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        // Create user profile in the users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            username,
            role: 'user'
          });

        if (profileError) {
          throw profileError;
        }
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Sign in existing user
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  };

  // Check if user has admin role
  const isAdmin = () => {
    return userProfile?.role === 'admin';
  };

  // Context value
  const value = {
    user,
    userProfile,
    loading,
    configError,
    isAdmin,
    signUp,
    signIn,
    signOut,
    supabase
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

// Custom hook to use the Supabase context
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

export default SupabaseContext;
