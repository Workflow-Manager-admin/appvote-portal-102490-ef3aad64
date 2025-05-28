import React, { createContext, useContext } from 'react';
import { useMachine } from '@xstate/react';
import { authMachine } from './authMachine';
import { contestMachine } from './contestMachine';
import { appStateMachine } from './appStateMachine';
import { useSupabase } from '../services/SupabaseContext';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getUserProfile,
  getActiveContest,
  getAllContests,
  getContestById, 
  createContest, 
  updateContestStatus,
  getAppsByContest,
  getUserApps,
  getAppById,
  submitApp,
  getUserVotesInContest,
  submitVote,
  declareWinners,
  getContestWinners
} from '../services/supabaseSchemaSetup';

// Create context for state machines
const AppStateContext = createContext(null);

/**
 * AppStateProvider - Provides access to all state machines and their services throughout the app
 */
export const AppStateProvider = ({ children }) => {
  const { user, userProfile, supabase, isAdmin } = useSupabase();
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Auth machine services
  const authServices = {
    checkAuth: async () => {
      // Initial auth check is handled by SupabaseContext
      return { user, userProfile };
    },
    login: async (context) => {
      const { email, password } = context.formData;
      const { user, error } = await loginUser(email, password);
      
      if (error) throw error;
      
      // Fetch user profile after successful login
      const { profile, error: profileError } = await getUserProfile(user.id);
      if (profileError) throw profileError;
      
      return { user, userProfile: profile };
    },
    register: async (context) => {
      const { email, password, username } = context.formData;
      const { user, error } = await registerUser(email, password, username);
      
      if (error) throw error;
      
      // Fetch user profile after successful registration
      const { profile, error: profileError } = await getUserProfile(user.id);
      if (profileError) throw profileError;
      
      return { user, userProfile: profile };
    },
    logout: async () => {
      const { error } = await logoutUser();
      if (error) throw error;
      return true;
    }
  };

  // Contest machine services
  const contestServices = {
    loadContests: async () => {
      const { contests, error } = await getAllContests();
      if (error) throw error;
      
      const { contest: activeContest, error: activeError } = await getActiveContest();
      if (activeError) throw activeError;
      
      return { contests, activeContest };
    },
    loadContestDetails: async (_, event) => {
      const { contestId } = event;
      const { contest, error } = await getContestById(contestId);
      if (error) throw error;
      
      return contest;
    },
    createContest: async (context) => {
      const { name, startDate, endDate } = context.formData;
      const { contest, error } = await createContest({
        name,
        start_date: startDate,
        end_date: endDate
      });
      
      if (error) throw error;
      return { contest };
    },
    updateContest: async (context, event) => {
      const { contestId, status } = event;
      const { contest, error } = await updateContestStatus(contestId, status);
      
      if (error) throw error;
      return { contest };
    },
    endContest: async (_, event) => {
      const { contestId } = event;
      const { contest, error } = await updateContestStatus(contestId, 'completed');
      
      if (error) throw error;
      return { contest };
    },
    declareWinners: async (_, event) => {
      const { contestId, winners } = event;
      const { winners: declaredWinners, error } = await declareWinners(contestId, winners);
      
      if (error) throw error;
      return { winners: declaredWinners };
    }
  };

  // App state machine services
  const appServices = {
    loadApps: async (_, event) => {
      const { contestId } = event;
      const { apps, error } = await getAppsByContest(contestId);
      
      if (error) throw error;
      return { apps };
    },
    loadUserApps: async () => {
      if (!user) return { apps: [] };
      
      const { apps, error } = await getUserApps(user.id);
      if (error) throw error;
      
      return { apps };
    },
    loadUserVotes: async (_, event) => {
      if (!user) return { votes: [] };
      
      const { contestId } = event;
      const { votes, error } = await getUserVotesInContest(user.id, contestId);
      if (error) throw error;
      
      return { votes };
    },
    createApp: async (context, event) => {
      const { appName, appLink, appDescription, appImage } = context.formData;
      const { contestId } = event;
      
      let imageUrl = null;
      
      // Upload image if provided
      if (appImage) {
        const filename = `${user.id}-${Date.now()}`;
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('app-images')
          .upload(filename, appImage);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('app-images')
          .getPublicUrl(filename);
          
        imageUrl = urlData.publicUrl;
      }
      
      const appData = {
        name: appName,
        link: appLink,
        description: appDescription,
        image_url: imageUrl
      };
      
      const { app, error } = await submitApp(appData, user.id, contestId);
      if (error) throw error;
      
      return { app };
    },
    voteForApp: async (_, event) => {
      const { appId, contestId } = event;
      const { vote, error } = await submitVote(appId, user.id, contestId);
      
      if (error) throw error;
      return { vote };
    },
    loadAppDetails: async (_, event) => {
      const { appId } = event;
      const { app, error } = await getAppById(appId);
      
      if (error) throw error;
      return { app };
    }
  };

  // Create machine instances with their services
  const [authState, authSend] = useMachine(authMachine, {
    services: authServices,
    context: {
      user,
      userProfile,
      error: null
    }
  });
  
  const [contestState, contestSend] = useMachine(contestMachine, {
    services: contestServices,
    guards: {
      isAdmin
    },
    actions: {
      notifyContestCreated: () => {},
      notifyContestUpdated: () => {},
      notifyWinnersDeclared: () => {},
      notifyContestEnded: () => {}
    }
  });
  
  const [appState, appSend] = useMachine(appStateMachine, {
    services: appServices,
    actions: {
      updateAppVoteCount: () => {}
    }
  });

  // Initialize machines and ensure they're ready
  // Initialize machines synchronously to ensure proper actor lifecycles
  React.useEffect(() => {
    let mounted = true;

    const initializeMachines = async () => {
      try {
        // Start the actors in order of dependency
        await authState.start();
        await contestState.start();
        await appState.start();

        // Only update state if component is still mounted
        if (mounted) {
          authSend({ type: 'INITIALIZED' });
          contestSend({ type: 'INITIALIZED' });
          appSend({ type: 'INITIALIZED' });
          setIsInitialized(true);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
        }
      }
    };

    initializeMachines();

    // Cleanup function to handle actor disposal in reverse order
    return () => {
      mounted = false;
      // Stop actors in reverse order of dependency
      appState.stop();
      contestState.stop();
      authState.stop();
    };
  }, [authSend, contestSend, appSend, authState, contestState, appState]);

  if (error) {
    return (
      <div className="error-boundary">
        <h2>Failed to initialize application state</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="loading">
        <p>Initializing application...</p>
      </div>
    );
  }

  // Provide state and send functions to components
  const value = {
    authState,
    authSend,
    contestState,
    contestSend,
    appState,
    appSend
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

/**
 * PUBLIC_INTERFACE
 * Custom hook to use app state context
 * @returns {Object} Context object with state machine services
 */
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

/**
 * PUBLIC_INTERFACE
 * Custom hook to use auth state machine
 * @returns {Object} Auth state and send function
 */
export const useAuth = () => {
  const { authState, authSend } = useAppState();
  const mountedRef = React.useRef(true);
  
  React.useEffect(() => {
    // Set mounted flag
    mountedRef.current = true;
    
    // Check if actor is already running to prevent duplicate starts
    if (authState.status !== 'running') {
      authState.start();
    }
    
    return () => {
      mountedRef.current = false;
      // Only stop if we started it and component is unmounting
      if (authState.status === 'running') {
        authState.stop();
      }
    };
  }, [authState]);

  // Verify actor status before returning
  if (!authState || authState.status !== 'running' || !authSend) {
    throw new Error('Auth state machine not properly initialized or has been stopped');
  }

  // Return wrapped send function that checks mounted status
  const safeSend = React.useCallback((...args) => {
    if (mountedRef.current && authState.status === 'running') {
      authSend(...args);
    }
  }, [authSend, authState]);

  return { state: authState, send: safeSend };
};

/**
 * PUBLIC_INTERFACE
 * Custom hook to use contest state machine
 * @returns {Object} Contest state and send function
 */
export const useContest = () => {
  const { contestState, contestSend } = useAppState();
  const mountedRef = React.useRef(true);
  
  React.useEffect(() => {
    mountedRef.current = true;
    
    if (contestState.status !== 'running') {
      contestState.start();
    }
    
    return () => {
      mountedRef.current = false;
      if (contestState.status === 'running') {
        contestState.stop();
      }
    };
  }, [contestState]);

  if (!contestState || contestState.status !== 'running' || !contestSend) {
    throw new Error('Contest state machine not properly initialized or has been stopped');
  }

  const safeSend = React.useCallback((...args) => {
    if (mountedRef.current && contestState.status === 'running') {
      contestSend(...args);
    }
  }, [contestSend, contestState]);

  return { state: contestState, send: safeSend };
};

/**
 * PUBLIC_INTERFACE
 * Custom hook to use app state machine
 * @returns {Object} App state and send function
 */
export const useAppMachine = () => {
  const { appState, appSend } = useAppState();
  const mountedRef = React.useRef(true);
  
  React.useEffect(() => {
    mountedRef.current = true;
    
    if (appState.status !== 'running') {
      appState.start();
    }
    
    return () => {
      mountedRef.current = false;
      if (appState.status === 'running') {
        appState.stop();
      }
    };
  }, [appState]);

  if (!appState || appState.status !== 'running' || !appSend) {
    throw new Error('App state machine not properly initialized or has been stopped');
  }

  const safeSend = React.useCallback((...args) => {
    if (mountedRef.current && appState.status === 'running') {
      appSend(...args);
    }
  }, [appSend, appState]);

  return { state: appState, send: safeSend };
};

export default AppStateContext;
