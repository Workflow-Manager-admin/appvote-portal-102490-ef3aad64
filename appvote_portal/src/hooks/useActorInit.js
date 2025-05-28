import { useEffect, useRef } from 'react';

/**
 * Custom hook for safely initializing and managing XState actors
 * Ensures proper initialization, error handling, and cleanup of actors
 */
export const useActorInit = (actor, onError) => {
  const mountedRef = useRef(true);
  const actorRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    
    const initActor = async () => {
      try {
        if (!actor) {
          throw new Error('Actor is undefined');
        }

        // Store reference to current actor
        actorRef.current = actor;

        // Ensure actor is started
        if (actor.status !== 'running') {
          await actor.start();
        }

        // Verify actor is properly initialized
        if (!actor.getSnapshot()) {
          throw new Error('Actor snapshot unavailable after initialization');
        }

        errorRef.current = null;
      } catch (err) {
        errorRef.current = err;
        if (onError && mountedRef.current) {
          onError(err);
        }
      }
    };

    initActor();

    return () => {
      mountedRef.current = false;
      
      // Safely stop actor on unmount
      const cleanup = async () => {
        try {
          if (actorRef.current?.status === 'running') {
            await actorRef.current.stop();
          }
        } catch (err) {
          console.error('Error stopping actor:', err);
          if (onError) {
            onError(err);
          }
        }
      };

      cleanup();
    };
  }, [actor, onError]);

  // Return safe wrapper around actor that checks initialization status
  const safeActor = {
    send: (...args) => {
      if (actorRef.current?.status === 'running') {
        return actorRef.current.send(...args);
      }
      throw new Error('Cannot send events to uninitialized or stopped actor');
    },
    status: actorRef.current?.status || 'unknown'
  };

  return { actor: safeActor, error: errorRef.current };
};
