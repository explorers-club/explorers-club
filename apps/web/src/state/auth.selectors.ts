import { AuthState } from './auth.machine';

export const selectAuthIsInitalized = (state: AuthState) =>
  state.matches('Authenticated') || state.matches('Unauthenticated');

export const selectPlayerName = (state: AuthState) =>
  state.context.profile?.player_name;
