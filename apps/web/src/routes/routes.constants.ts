import { ClubRoute } from './club';
import { HomeRoute } from './home';

export interface Route {
  path: string;
  state: string;
  Component: () => JSX.Element;
}

export const routes: Route[] = [
  { path: '/', state: 'Home', Component: HomeRoute },
  {
    path: '/:playerName',
    state: 'Club',
    Component: ClubRoute,
  },
];

export const defaultRoute = routes[0]; // Home
