import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { environment } from '../environments/environment';
import { ColyseusContext } from '../state/colyseus.context';
import { AppComponent } from './app.component';
import * as Colyseus from 'colyseus.js';

export const App = () => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  );
  const colyseusClient = useMemo(
    () => new Colyseus.Client(environment.colyseusHost),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ColyseusContext.Provider value={colyseusClient}>
        <AppComponent />
      </ColyseusContext.Provider>
    </QueryClientProvider>
  );
};
