import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import * as Colyseus from 'colyseus.js';
import { ColyseusContext } from '../state/colyseus.context';

import { Index } from './index.container';
import { Room } from './room.container';

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

const COLYSEUS_HOST_URL = 'ws://localhost:2567';

export const Routes = () => {
  const queryClient = useMemo(() => new QueryClient(), []);
  const colyseusClient = useMemo(() => new Colyseus.Client(COLYSEUS_HOST_URL), []);

  return (
    <QueryClientProvider client={queryClient}>
      <ColyseusContext.Provider value={colyseusClient}>
        <RouterProvider router={router} />
      </ColyseusContext.Provider>
    </QueryClientProvider>
  );
};
