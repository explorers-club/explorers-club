import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { GlobalStateContext } from '../../state/global.provider';
import { selectClubScreenActor } from '../../state/navigation.selectors';
import {
  selectMyPartyPlayerActor,
  selectPartyActor,
} from './club-screen.selectors';

export const useClubScreenActor = () => {
  const { navigationActor } = useContext(GlobalStateContext);
  return useSelector(navigationActor, selectClubScreenActor);
};

export const usePartyActor = () => {
  const clubScreenActor = useClubScreenActor();
  return useSelector(clubScreenActor, selectPartyActor);
};

export const useMyPartyPlayerActor = () => {
  const clubScreenActor = useClubScreenActor();
  return useSelector(clubScreenActor, selectMyPartyPlayerActor);
};

export const useHostPlayerName = () => {
  const actor = useClubScreenActor();
  return useSelector(actor, (state) => state.context.hostPlayerName);
};
