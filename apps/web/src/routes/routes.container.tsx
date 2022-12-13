import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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

export const Routes = () => {
  return <RouterProvider router={router} />;
};
