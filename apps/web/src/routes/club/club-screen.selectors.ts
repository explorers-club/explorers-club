import { ClubScreenState } from './club-screen.machine';

export const selectHostPlayerName = (state: ClubScreenState) =>
  state.context.hostPlayerName;
