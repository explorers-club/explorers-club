import { HomeScreen } from './home';
import { NewPartyScreen } from './new-party';
import { PartyScreen } from './party';

export interface Route {
  path: string;
  state: string;
  Component: () => JSX.Element;
}

export const routes: Route[] = [
  { path: '/', state: 'Home', Component: HomeScreen },
  {
    path: '/party/new',
    state: 'NewParty',
    Component: NewPartyScreen,
  },
  {
    path: '/party/:joinCode',
    state: 'Party',
    Component: PartyScreen,
  },
];

export const defaultRoute = routes[0]; // Home
