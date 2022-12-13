import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import * as Colyseus from 'colyseus.js';
import { ColyseusContext } from '../state/colyseus.context';

import { Index } from './index.container';
import { Room } from './room.container';
import { environment } from '../environments/environment';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/:roomId',
    element: <Room />,
  },
]);

export const Routes = () => {
  const queryClient = useMemo(() => new QueryClient(), []);
  const colyseusClient = useMemo(() => new Colyseus.Client(environment.colyseusHost), []);

  return (
    <QueryClientProvider client={queryClient}>
      <ColyseusContext.Provider value={colyseusClient}>
        <RouterProvider router={router} />
      </ColyseusContext.Provider>
    </QueryClientProvider>
  );
};
