  const [isInitialized, setIsInitialized] = React.useState(false);
  const [error, setError] = React.useState(null);
  const mountedRef = React.useRef(true);

  // Auth machine services
  const authServices = {
    checkAuth: async () => {
      return { user, userProfile };
    },
    login: async (context) => {
      const { email, password } = context.formData;
      const { user, error } = await loginUser(email, password);
      
      if (error) throw error;
      
      const { profile, error: profileError } = await getUserProfile(user.id);
      if (profileError) throw profileError;
      
      return { user, userProfile: profile };
    },
    register: async (context) => {
      const { email, password, username } = context.formData;
      const { user, error } = await registerUser(email, password, username);
      
      if (error) throw error;
      
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
      
      if (appImage) {
        const filename = `${user.id}-${Date.now()}`;
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('app-images')
          .upload(filename, appImage);
          
        if (uploadError) throw uploadError;
        
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
  React.useEffect(() => {
    mountedRef.current = true;

    const initializeMachines = async () => {
      try {
        // Start the actors in order of dependency
        await authState.start();
        await contestState.start();
        await appState.start();

        // Only update state if component is still mounted
        if (mountedRef.current) {
          authSend({ type: 'INITIALIZED' });
          contestSend({ type: 'INITIALIZED' });
          appSend({ type: 'INITIALIZED' });
          setIsInitialized(true);
        }
      } catch (err) {
        if (mountedRef.current) {
          console.error('Error initializing state machines:', err);
          setError(err);
        }
      }
    };

    initializeMachines();

    return () => {
      mountedRef.current = false;
      // Stop actors in reverse order of dependency
      try {
        if (appState.status === 'running') appState.stop();
        if (contestState.status === 'running') contestState.stop();
        if (authState.status === 'running') authState.stop();
      } catch (err) {
        console.error('Error stopping state machines:', err);
      }
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
 */
export const useAuth = () => {
  const { authState, authSend } = useAppState();
  const { actor: safeActor, error } = useActorInit(authState, (err) => {
    console.error('Auth actor error:', err);
  });

  if (error) {
    throw error;
  }

  return {
    state: authState,
    send: safeActor.send,
    status: safeActor.status
  };
};

/**
 * PUBLIC_INTERFACE
 * Custom hook to use contest state machine
 */
export const useContest = () => {
  const { contestState, contestSend } = useAppState();
  const { actor: safeActor, error } = useActorInit(contestState, (err) => {
    console.error('Contest actor error:', err);
  });

  if (error) {
    throw error;
  }

  return {
    state: contestState,
    send: safeActor.send,
    status: safeActor.status
  };
};

/**
 * PUBLIC_INTERFACE
 * Custom hook to use app state machine
 */
export const useAppMachine = () => {
  const { appState, appSend } = useAppState();
  const { actor: safeActor, error } = useActorInit(appState, (err) => {
    console.error('App actor error:', err);
  });

  if (error) {
    throw error;
  }

  return {
    state: appState,
    send: safeActor.send,
    status: safeActor.status
  };
};

export default AppStateContext;
