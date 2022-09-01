// Inspired by https://stately.ai/blog/how-to-manage-global-state-with-xstate-and-react

import { useInterpret } from '@xstate/react';
import { createContext, FC, ReactNode } from 'react';
import appMachine, { AppActor } from './app.machine';

interface GlobalStateContextType {
  appActor: AppActor;
}

export const GlobalStateContext = createContext({} as GlobalStateContextType);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const appActor = useInterpret(appMachine);

  return (
    <GlobalStateContext.Provider value={{ appActor }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
