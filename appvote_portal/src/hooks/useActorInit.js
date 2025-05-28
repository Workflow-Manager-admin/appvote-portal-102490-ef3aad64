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
        if (!actor) {
          throw new Error('Actor is undefined');
        }

        actorRef.current = actor;

        if (actor.status !== 'running') {
          await actor.start();
        }

        if (mountedRef.current) {
          setIsReady(true);
          setError(null);
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
    status: actorRef.current?.status || 'stopped',
    send: (...args) => {
      if (!isReady || !mountedRef.current || !actorRef.current) {
        console.warn('Attempted to send event to uninitialized actor');
        return;
      }

      if (actorRef.current.status !== 'running') {
        console.warn('Attempted to send event to non-running actor');
        return;
      }

      try {
        actorRef.current.send(...args);
      } catch (err) {
        console.error('Error sending event to actor:', err);
        setError(err);
        onError?.(err);
      }
    },
    start: async () => {
      try {
        if (!actorRef.current) {
          throw new Error('Actor is undefined');
        }
        await actorRef.current.start();
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
        actorRef.current?.stop();
      } catch (err) {
        console.error('Error stopping actor:', err);
      }
    },
    getSnapshot: () => {
      if (!isReady || !actorRef.current) {
        return undefined;
      }
      try {
        return actorRef.current.getSnapshot();
      } catch (err) {
        console.error('Error getting actor snapshot:', err);
        return undefined;
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
