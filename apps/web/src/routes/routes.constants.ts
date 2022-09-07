import { Home } from './home/home.component';
import { Party } from './party';

export interface Route {
  path: string;
  state: string;
  Component: () => JSX.Element;
}

export const routes: Route[] = [
  { path: '/', state: 'Home', Component: Home },
  {
    path: '/party/:code',
    state: 'Party',
    Component: Party,
  },
];

export const defaultRoute = routes[0]; // Home
