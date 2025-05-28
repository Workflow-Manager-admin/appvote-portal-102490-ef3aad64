import { createMachine, assign } from 'xstate';

/**
 * Application State Machine
 * 
 * This machine handles the overall application state:
 * - App initialization
 * - User submissions
 * - Voting process
 * - Admin operations
 * - Global notifications and UI states
 */
export const appStateMachine = createMachine({
  id: 'app',
  initial: 'initializing',
  context: {
    apps: [],
    userApps: [],
    userVotes: [],
    currentApp: null,
    notification: null,
    isLoading: false,
    error: null,
    formData: {
      appName: '',
      appLink: '',
      appDescription: '',
      appImage: null
    }
  },
  states: {
    // App initialization
    initializing: {
      on: {
        INITIALIZED: 'ready'
      }
    },
    
    // App ready state - main application state
    ready: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            LOAD_APPS: 'loadingApps',
            LOAD_USER_APPS: 'loadingUserApps', 
            LOAD_USER_VOTES: 'loadingUserVotes',
            CREATE_APP: 'creatingApp',
            VOTE_APP: 'voting',
            LOAD_APP_DETAILS: 'loadingAppDetails'
          }
        },
        
        // Loading all apps for a contest
        loadingApps: {
          entry: assign({ isLoading: true }),
          invoke: {
            src: 'loadApps',
            onDone: {
              target: 'idle',
              actions: assign({
                apps: (_, event) => event.data.apps || [],
                isLoading: false,
                error: null
              })
            },
            onError: {
              target: 'idle',
              actions: assign({
                error: (_, event) => event.data,
                isLoading: false
              })
            }
          }
        },
        
        // Loading apps submitted by the current user
        loadingUserApps: {
          entry: assign({ isLoading: true }),
          invoke: {
            src: 'loadUserApps',
            onDone: {
              target: 'idle',
              actions: assign({
                userApps: (_, event) => event.data.apps || [],
                isLoading: false,
                error: null
              })
            },
            onError: {
              target: 'idle',
              actions: assign({
                error: (_, event) => event.data,
                isLoading: false
              })
            }
          }
        },
        
        // Loading votes cast by the current user
        loadingUserVotes: {
          entry: assign({ isLoading: true }),
          invoke: {
            src: 'loadUserVotes',
            onDone: {
              target: 'idle',
              actions: assign({
                userVotes: (_, event) => event.data.votes || [],
                isLoading: false,
                error: null
              })
            },
            onError: {
              target: 'idle',
              actions: assign({
                error: (_, event) => event.data,
                isLoading: false
              })
            }
          }
        },
        
        // Creating a new app submission
        creatingApp: {
          entry: assign({
            formData: (context, event) => ({
              ...context.formData,
              appName: event.appName,
              appLink: event.appLink,
              appDescription: event.appDescription,
              appImage: event.appImage
            }),
            isLoading: true
          }),
          invoke: {
            src: 'createApp',
            onDone: {
              target: 'idle',
              actions: [
                assign({
                  userApps: (context, event) => [...context.userApps, event.data.app],
                  apps: (context, event) => [...context.apps, event.data.app],
                  isLoading: false,
                  notification: {
                    type: 'success',
                    message: 'App submitted successfully!'
                  },
                  error: null
                })
              ]
            },
            onError: {
              target: 'idle',
              actions: assign({
                error: (_, event) => event.data,
                isLoading: false,
                notification: {
                  type: 'error',
                  message: 'Failed to submit app. Please try again.'
                }
              })
            }
          }
        },
        
        // Voting for an app
        voting: {
          entry: assign({ isLoading: true }),
          invoke: {
            src: 'voteForApp',
            onDone: {
              target: 'idle',
              actions: [
                assign({
                  userVotes: (context, event) => [...context.userVotes, event.data.vote],
                  isLoading: false,
                  notification: {
                    type: 'success',
                    message: 'Vote submitted successfully!'
                  },
                  error: null
                }),
                'updateAppVoteCount'
              ]
            },
            onError: {
              target: 'idle',
              actions: assign({
                error: (_, event) => event.data,
                isLoading: false,
                notification: {
                  type: 'error',
                  message: event.data.message || 'Failed to submit vote. Please try again.'
                }
              })
            }
          }
        },
        
        // Loading details of a specific app
        loadingAppDetails: {
          entry: assign({ isLoading: true }),
          invoke: {
            src: 'loadAppDetails',
            onDone: {
              target: 'idle',
              actions: assign({
                currentApp: (_, event) => event.data.app,
                isLoading: false,
                error: null
              })
            },
            onError: {
              target: 'idle',
              actions: assign({
                error: (_, event) => event.data,
                isLoading: false
              })
            }
          }
        }
      },
      
      // Shared events across all ready states
      on: {
        CLEAR_NOTIFICATION: {
          actions: assign({
            notification: null
          })
        },
        SET_ERROR: {
          actions: assign({
            error: (_, event) => event.error,
            notification: {
              type: 'error',
              message: event.error.message || 'An error occurred. Please try again.'
            }
          })
        },
        CLEAR_ERROR: {
          actions: assign({
            error: null
          })
        }
      }
    },
    
    // Handling unexpected errors
    failure: {
      on: {
        RETRY: 'initializing'
      }
    }
  }
});
