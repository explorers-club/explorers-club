// Inspired by https://stately.ai/blog/how-to-manage-global-state-with-xstate-and-react
import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BottomSheetRef } from 'react-spring-bottom-sheet';
import { interpret } from 'xstate';
import { useCurrentRoute } from '../routes/route.hooks';
import { AppActor, createAppMachine } from './app.machine';
import { createAuthMachine, AuthActor } from './auth.machine';
import { createNavigationMachine, NavigationActor } from './navigation.machine';
import { createPartyMachine, PartyActor } from './party.machine';

interface GlobalStateContextType {
  appActor: AppActor;
  sheetRef: React.RefObject<BottomSheetRef>;
}

declare global {
  interface Window {
    $APP: AppActor;
    $AUTH: AuthActor;
    $PARTY: PartyActor;
    $NAVIGATION: NavigationActor;
  }
}

export const GlobalStateContext = createContext({} as GlobalStateContextType);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const sheetRef = useRef<BottomSheetRef>(null);
  const route = useCurrentRoute();
  const { partyCode } = useParams();
  const navigate = useNavigate();

  // Initialize the actor machines
  const [actorRefs] = useState(() => {
    const partyMachine = createPartyMachine({ code: partyCode });

    const partyActor = interpret(partyMachine);

    const user = null; // TODO initialize this
    const authMachine = createAuthMachine({ user });
    const authActor = interpret(authMachine);

    const navigationMachine = createNavigationMachine({
      partyActor,
      authActor,
      navigate,
      currentRoute: route,
      sheetRef,
    });
    const navigationActor = interpret(navigationMachine);

    const appMachine = createAppMachine({
      partyActor,
      authActor,
      navigationActor,
    });
    const appActor = interpret(appMachine);

    // Setup for debugging
    if (window) {
      window.$APP = appActor;
      window.$AUTH = authActor;
      window.$PARTY = partyActor;
      window.$NAVIGATION = navigationActor;
    }

    return { appActor, authActor, partyActor, navigationActor };
  });
  const { appActor, authActor, partyActor, navigationActor } = actorRefs;

  useEffect(() => {
    appActor.start();
    authActor.start();
    partyActor.start();
    navigationActor.start();

    appActor.subscribe(createLogger(appActor.id));
    authActor.subscribe(createLogger(authActor.id));
    partyActor.subscribe(createLogger(partyActor.id));
    navigationActor.subscribe(createLogger(navigationActor.id));

    return () => {
      appActor.stop();
      authActor.stop();
      partyActor.stop();
      navigationActor.stop();
    };
  }, [appActor, authActor, partyActor, navigationActor]);

  return (
    <GlobalStateContext.Provider value={{ appActor, sheetRef }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

const createLogger = (id: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (state: any) => {
    // TODO prod check
    console.log(
      `[${id}]`,
      `[State: ${state.value}]`,
      `[Event: ${state.event.type}]`
    );
  };
};
