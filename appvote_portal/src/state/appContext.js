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
      isAdmin // Use the isAdmin function from SupabaseContext
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
 * Custom hook to use and select from the auth state machine
 * @param {Function} selector - Selector function
 * @returns {any} Selected state value
 */
export const useAuth = (selector) => {
  const { authService } = useAppState();
  return useSelector(authService, selector);
};

/**
 * PUBLIC_INTERFACE
 * Custom hook to use and select from the contest state machine
 * @param {Function} selector - Selector function
 * @returns {any} Selected state value
 */
export const useContest = (selector) => {
  const { contestService } = useAppState();
  return useSelector(contestService, selector);
};

/**
 * PUBLIC_INTERFACE
 * Custom hook to use and select from the app state machine
 * @param {Function} selector - Selector function
 * @returns {any} Selected state value
 */
export const useAppMachine = (selector) => {
  const { appService } = useAppState();
  return useSelector(appService, selector);
};

export default AppStateContext;
