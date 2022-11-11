import { HomeScreen } from './home';
import { ClubScreen, ClubScreenFooter } from './club';
import { ClubScreenHeader } from './club/club-screen-header.container';

export interface Route {
  path: string;
  state: string;
  Component: () => JSX.Element;
  HeaderComponent?: () => JSX.Element;
  FooterComponent?: () => JSX.Element;
}

export const routes: Route[] = [
  { path: '/', state: 'Home', Component: HomeScreen },
  {
    path: '/:playerName',
    state: 'Club',
    Component: ClubScreen,
    FooterComponent: ClubScreenFooter,
    HeaderComponent: ClubScreenHeader,
  },
];

export const defaultRoute = routes[0]; // Home
