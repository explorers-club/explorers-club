import { HomeScreen } from './home';
import { ClubScreen } from './club';

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
    Component: ClubScreen,
  },
];

export const defaultRoute = routes[0]; // Home
