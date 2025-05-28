import { createMachine, assign } from 'xstate';

/**
 * Contest State Machine
 * 
 * This machine handles contest-related states and actions:
 * - Loading contests
 * - Active contest management
 * - Contest creation (admin)
 * - Contest updates (admin)
 * - Winners declaration (admin)
 */
export const contestMachine = createMachine({
  id: 'contest',
  initial: 'loading',
  context: {
    contests: [],
    activeContest: null,
    winners: [],
    error: null,
    formData: {
      name: '',
      startDate: '',
      endDate: ''
    }
  },
  states: {
    // Initial loading state
    loading: {
      invoke: {
        src: 'loadContests',
        onDone: {
          target: 'loaded',
          actions: assign({
            contests: (_context, event) => event.data.contests,
            activeContest: (_context, event) => event.data.activeContest || null,
            error: (_context, _event) => null
          })
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: (_, evt) => evt.data
          })
        }
      }
    },
    
    // Contests loaded successfully
    loaded: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            CREATE_CONTEST: {
              target: 'creating',
              guard: (_, __, { isAdmin }) => isAdmin()
            },
            LOAD_CONTEST_DETAILS: {
              target: 'loadingDetails'
            },
            UPDATE_CONTEST: {
              target: 'updating',
              guard: (_, __, { isAdmin }) => isAdmin()
            },
            DECLARE_WINNERS: {
              target: 'declaringWinners',
              guard: (_, __, { isAdmin }) => isAdmin()
            },
            END_CONTEST: {
              target: 'ending',
              guard: (_, __, { isAdmin }) => isAdmin()
            }
          }
        },
        
        // Loading details of a specific contest
        loadingDetails: {
          invoke: {
            src: 'loadContestDetails',
            onDone: {
              target: 'idle',
              actions: assign({
                activeContest: (_, event) => event.data,
                error: null
              })
            },
            onError: {
              target: 'idle',
              actions: assign({
                error: (_, event) => event.data
              })
            }
          }
        },
        
        // Creating a new contest (admin only)
        creating: {
          entry: assign({
            formData: (context, event) => ({
              ...context.formData,
              name: event.name,
              startDate: event.startDate,
              endDate: event.endDate
            })
          }),
          invoke: {
            src: 'createContest',
            onDone: {
              target: 'idle',
              actions: [
                assign({
                  contests: (context, event) => [...context.contests, event.data.contest],
                  activeContest: (_, event) => event.data.contest,
                  error: null
                }),
                'notifyContestCreated'
              ]
            },
            onError: {
              target: 'idle',
              actions: assign({
                error: (_, event) => event.data
              })
            }
          }
        },
        
        // Updating an existing contest (admin only)
        updating: {
          entry: assign({
            formData: (context, event) => ({
              ...context.formData,
              name: event.name,
              startDate: event.startDate,
              endDate: event.endDate
            })
          }),
          invoke: {
            src: 'updateContest',
            onDone: {
              target: 'idle',
              actions: [
                assign({
                  contests: (context, event) => {
                    return context.contests.map(contest => 
                      contest.id === event.data.contest.id ? event.data.contest : contest
                    );
                  },
                  activeContest: (context, event) => {
                    return context.activeContest?.id === event.data.contest.id 
                      ? event.data.contest 
                      : context.activeContest;
                  },
                  error: null
                }),
                'notifyContestUpdated'
              ]
            },
            onError: {
              target: 'idle',
              actions: assign({
                error: (_, event) => event.data
              })
            }
          }
        },
        
        // Declaring winners for a contest (admin only)
        declaringWinners: {
          invoke: {
            src: 'declareWinners',
            onDone: {
              target: 'idle',
              actions: [
                assign({
                  winners: (_, event) => event.data.winners,
                  error: null
                }),
                'notifyWinnersDeclared'
              ]
            },
            onError: {
              target: 'idle',
              actions: assign({
                error: (_, event) => event.data
              })
            }
          }
        },
        
        // Ending the active contest (admin only)
        ending: {
          invoke: {
            src: 'endContest',
            onDone: {
              target: 'idle',
              actions: [
                assign({
                  contests: (context, event) => {
                    return context.contests.map(contest => 
                      contest.id === event.data.contest.id ? event.data.contest : contest
                    );
                  },
                  activeContest: (_, event) => null,
                  error: null
                }),
                'notifyContestEnded'
              ]
            },
            onError: {
              target: 'idle',
              actions: assign({
                error: (_, event) => event.data
              })
            }
          }
        }
      },
      
      // Shared events across all loaded states
      on: {
        REFRESH: {
          target: 'loading'
        }
      }
    },
    
    // Error state
    failure: {
      on: {
        RETRY: {
          target: 'loading'
        }
      }
    }
  }
});
