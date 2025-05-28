import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for safely initializing and managing XState actors
 * Handles mounting, unmounting, and error states
 */
export function useActorInit(actor, onError) {
  const mountedRef = useRef(true);
  const actorRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    mountedRef.current = true;

    const initActor = async () => {
      try {
        if (actor && actor.status !== 'running') {
          await actor.start();
          if (mountedRef.current) {
            setIsReady(true);
          }
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err);
          onError?.(err);
        }
      }
    };

    initActor();

    return () => {
      mountedRef.current = false;
      try {
        if (actor?.status === 'running') {
          actor.stop();
        }
      } catch (err) {
        console.error('Error stopping actor:', err);
      }
    };
  }, [actor, onError]);

  const safeActor = {
    status: actor?.status || 'stopped',
    send: (...args) => {
      if (mountedRef.current && actor?.status === 'running') {
        try {
          actor.send(...args);
        } catch (err) {
          console.error('Error sending event to actor:', err);
          setError(err);
          onError?.(err);
        }
      }
    },
    start: async () => {
      try {
        await actor?.start();
        if (mountedRef.current) {
          setIsReady(true);
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err);
          onError?.(err);
        }
      }
    },
    stop: () => {
      try {
        actor?.stop();
      } catch (err) {
        console.error('Error stopping actor:', err);
      }
    }
  };

  return {
    actor: safeActor,
    isReady,
    error,
    isMounted: mountedRef.current
  };
}
