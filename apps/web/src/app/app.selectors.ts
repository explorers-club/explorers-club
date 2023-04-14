import { AppState } from '../state/app.machine';

export const selectNavIsOpen = (state: AppState) =>
  state.matches('Navigation.Open');

export const selectLoginIsOpen = (state: AppState) =>
  state.matches('Login.Open');
