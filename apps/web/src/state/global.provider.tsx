// Inspired by https://stately.ai/blog/how-to-manage-global-state-with-xstate-and-react
import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interpret } from 'xstate';
import { useActorLogger } from '../lib/logging';
import { useCurrentRoute } from '../routes/route.hooks';
import { AuthActor, createAuthMachine } from './auth.machine';
import { createNavigationMachine, NavigationActor } from './navigation.machine';

interface GlobalStateContextType {
  authActor: AuthActor;
  navigationActor: NavigationActor;
}

declare global {
  interface Window {
    $AUTH: AuthActor;
    $NAVIGATION: NavigationActor;
  }
}

export const GlobalStateContext = createContext({} as GlobalStateContextType);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const route = useCurrentRoute();
  const navigate = useNavigate();

  // Initialize the actor machines
  const [actorRefs] = useState(() => {
    const authMachine = createAuthMachine();
    const authActor = interpret(authMachine);

    const navigationMachine = createNavigationMachine({
      initial: route.state,
      navigate,
      authActor,
    });
    const navigationActor = interpret(navigationMachine);

    // Setup for debugging
    if (window) {
      window.$AUTH = authActor;
      window.$NAVIGATION = navigationActor;
    }

    return { authActor, navigationActor };
  });
  const { authActor, navigationActor } = actorRefs;

  useEffect(() => {
    authActor.start();
    navigationActor.start();

    return () => {
      authActor.stop();
      navigationActor.stop();
    };
  }, [authActor, navigationActor]);

  // useActorLogger(appActor);
  useActorLogger(authActor);
  // useActorLogger(navigationActor);

  return (
    <GlobalStateContext.Provider
      value={{ authActor, navigationActor }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
