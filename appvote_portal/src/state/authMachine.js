import { createMachine, assign } from 'xstate';

/**
 * Authentication State Machine
 * 
 * This machine handles the authentication flow:
 * - Initial authentication check
 * - Login process
 * - Registration process
 * - Logout process
 * - Error handling for auth operations
 */
export const authMachine = createMachine({
  id: 'auth',
  initial: 'checking',
  context: {
    user: null,
    userProfile: null,
    error: null,
    formData: {
      email: '',
      password: '',
      username: ''
    }
  },
  states: {
    // Initial state - checking if user is already authenticated
    checking: {
      invoke: {
        src: 'checkAuth',
        onDone: {
          target: 'authenticated',
          actions: assign({
            user: (_context, event) => event.data.user,
            userProfile: (_context, event) => event.data.userProfile,
            error: (_context, _event) => null
          })
        },
        onError: {
          target: 'unauthenticated',
          actions: assign({
            user: null,
            userProfile: null,
            error: null
          })
        }
      }
    },
    
    // User is not authenticated
    unauthenticated: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            LOGIN: 'loggingIn',
            REGISTER: 'registering'
          }
        },
        loggingIn: {
          entry: assign({
            formData: (context, event) => ({
              ...context.formData,
              email: event.email,
              password: event.password
            })
          }),
          invoke: {
            src: 'login',
            onDone: {
              target: '#auth.authenticated',
              actions: assign({
                user: (_, event) => event.data.user,
                userProfile: (_, event) => event.data.userProfile,
                error: null
              })
            },
            onError: {
              target: 'loginError',
              actions: assign({
                error: (_, event) => event.data
              })
            }
          }
        },
        loginError: {
          on: {
            LOGIN: 'loggingIn',
            REGISTER: 'registering',
            RESET: 'idle'
          }
        },
        registering: {
          entry: assign({
            formData: (context, event) => ({
              ...context.formData,
              email: event.email,
              password: event.password,
              username: event.username
            })
          }),
          invoke: {
            src: 'register',
            onDone: {
              target: '#auth.authenticated',
              actions: assign({
                user: (_, event) => event.data.user,
                userProfile: (_, event) => event.data.userProfile,
                error: null
              })
            },
            onError: {
              target: 'registerError',
              actions: assign({
                error: (_, event) => event.data
              })
            }
          }
        },
        registerError: {
          on: {
            REGISTER: 'registering',
            LOGIN: 'loggingIn',
            RESET: 'idle'
          }
        }
      }
    },
    
    // User is authenticated
    authenticated: {
      on: {
        LOGOUT: {
          target: 'loggingOut'
        },
        UPDATE_PROFILE: {
          actions: assign({
            userProfile: (_, event) => event.userProfile
          })
        }
      }
    },
    
    // Logging out process
    loggingOut: {
      invoke: {
        src: 'logout',
        onDone: {
          target: 'unauthenticated',
          actions: assign({
            user: null,
            userProfile: null,
            error: null
          })
        },
        onError: {
          target: 'authenticated',
          actions: assign({
            error: (_, event) => event.data
          })
        }
      }
    }
  }
});
