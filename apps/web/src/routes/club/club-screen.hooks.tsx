import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { GlobalStateContext } from '../../state/global.provider';
import { ClubScreenActor } from './club-screen.machine';

export const useClubScreenActor = () => {
  const { navigationActor } = useContext(GlobalStateContext);
  return useSelector(
    navigationActor,
    (state) => state.children['clubScreenMachine'] as ClubScreenActor
  );
};

export const useHostPlayerName = () => {
  const actor = useClubScreenActor();
  return useSelector(actor, (state) => state.context.hostPlayerName);
};
