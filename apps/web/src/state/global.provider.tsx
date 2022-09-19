// Inspired by https://stately.ai/blog/how-to-manage-global-state-with-xstate-and-react
import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BottomSheetRef } from 'react-spring-bottom-sheet';
import { interpret } from 'xstate';
import { useActorLogger } from '../lib/logging';
import { useCurrentRoute } from '../routes/route.hooks';
import { AppActor, createAppMachine } from './app.machine';
import { AuthActor, createAuthMachine } from './auth.machine';
import { createNavigationMachine, NavigationActor } from './navigation.machine';
import { PartyConnectionActor } from './party-connection.machine';

interface GlobalStateContextType {
  appActor: AppActor;
  sheetRef: React.RefObject<BottomSheetRef>;
}

declare global {
  interface Window {
    $APP: AppActor;
    $AUTH: AuthActor;
    $PARTY_CONNECTION: PartyConnectionActor;
    $NAVIGATION: NavigationActor;
  }
}

export const GlobalStateContext = createContext({} as GlobalStateContextType);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const sheetRef = useRef<BottomSheetRef>(null);
  const route = useCurrentRoute();
  const navigate = useNavigate();

  // Initialize the actor machines
  const [actorRefs] = useState(() => {
    const user = null; // TODO initialize this
    const authMachine = createAuthMachine({ user });
    const authActor = interpret(authMachine);

    const navigationMachine = createNavigationMachine({
      initial: route.state,
      navigate,
    });
    const navigationActor = interpret(navigationMachine);

    const appMachine = createAppMachine({
      authActor,
      navigationActor,
    });
    const appActor = interpret(appMachine);

    // Setup for debugging
    if (window) {
      window.$APP = appActor;
      window.$AUTH = authActor;
      window.$NAVIGATION = navigationActor;
    }

    return { appActor, authActor, navigationActor };
  });
  const { appActor, authActor, navigationActor } = actorRefs;

  useEffect(() => {
    appActor.start();
    authActor.start();
    navigationActor.start();

    return () => {
      appActor.stop();
      authActor.stop();
      navigationActor.stop();
    };
  }, [appActor, authActor, navigationActor]);

  useActorLogger(appActor);
  useActorLogger(authActor);
  useActorLogger(navigationActor);

  return (
    <GlobalStateContext.Provider value={{ appActor, sheetRef }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
