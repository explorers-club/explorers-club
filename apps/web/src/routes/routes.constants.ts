import { Home } from './home/home.component';
import { NewParty } from './new-party';
import { Party } from './party';
import { PlayerSetup } from './player-setup';

export interface Route {
  path: string;
  state: string;
  Component: () => JSX.Element;
}

export const routes: Route[] = [
  { path: '/', state: 'Home', Component: Home },
  {
    path: '/player-setup',
    state: 'PlayerSetup',
    Component: PlayerSetup,
  },
  {
    path: '/party/new',
    state: 'NewParty',
    Component: NewParty,
  },
  {
    path: '/party/:code',
    state: 'Party',
    Component: Party,
  },
];

export const defaultRoute = routes[0]; // Home
