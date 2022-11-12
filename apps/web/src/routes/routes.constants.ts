import { ClubRoute } from './club';
import { HomeScreen } from './home';

export interface Route {
  path: string;
  state: string;
  Component: () => JSX.Element;
}

export const routes: Route[] = [
  { path: '/', state: 'Home', Component: HomeScreen },
  {
    path: '/:playerName',
    state: 'Club',
    Component: ClubRoute,
  },
];

export const defaultRoute = routes[0]; // Home
