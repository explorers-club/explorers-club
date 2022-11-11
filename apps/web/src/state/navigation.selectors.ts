import { ClubScreenActor } from '../routes/club/club-screen.machine';
import { NavigationState } from './navigation.machine';

export const selectClubScreenActor = (state: NavigationState) =>
  state.children['clubScreenMachine'] as ClubScreenActor;
