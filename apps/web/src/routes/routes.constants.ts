import { ClaimClubRoute } from './claim-club-route.componet';
import { ClubRoute } from './club-route.component';
import { HomeRoute } from './home-route.component';

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
  {
    path: '/:playerName/claim',
    state: 'ClaimClub',
    Component: ClaimClubRoute,
  },
];

export const defaultRoute = routes[0]; // Home
