import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Index } from './index.container';
import { Room } from './room.container';
import { NewRoom } from './new-room.container';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/new',
    element: <NewRoom />,
  },
  {
    path: '/:clubName',
    element: <Room />,
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
