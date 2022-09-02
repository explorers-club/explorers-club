// Inspired by https://stately.ai/blog/how-to-manage-global-state-with-xstate-and-react
import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BottomSheetRef } from 'react-spring-bottom-sheet';
import { Actor, interpret, State } from 'xstate';
import { useCurrentRoute } from '../routes/route.hooks';
import { AppActor, createAppMachine } from './app.machine';
import { createAuthMachine } from './auth.machine';
import { useActorLogger } from './logging-middleware';
import { createNavigationMachine } from './navigation.machine';
import { createPartyMachine } from './party.machine';

interface GlobalStateContextType {
  appActor: AppActor;
  sheetRef: React.RefObject<BottomSheetRef>;
}

export const GlobalStateContext = createContext({} as GlobalStateContextType);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const { partyCode } = useParams();
  const route = useCurrentRoute();
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
    });
    const navigationActor = interpret(navigationMachine);

    const appMachine = createAppMachine({
      partyActor,
      authActor,
      navigationActor,
    });
    const appActor = interpret(appMachine);

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

  const sheetRef = useRef<BottomSheetRef>(null);
  // useActorLogger(appActor);
  // useActorLogger(partyActor);
  // useActorLogger(authActor as Actor); // Not sure why this type is failing

  return (
    <GlobalStateContext.Provider value={{ appActor, sheetRef }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createLogger = (id: string) => {
  return (state: any) => {
    // TODO prod check
    console.log(`[${id}]`, state.event.type, state.value, state.context);
  };
};
