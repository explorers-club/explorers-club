import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { GlobalStateContext } from '../../state/global.provider';
import { selectClubScreenActor } from '../../state/navigation.selectors';

export const useClubScreenActor = () => {
  const { navigationActor } = useContext(GlobalStateContext);
  return useSelector(navigationActor, selectClubScreenActor);
};

export const useHostPlayerName = () => {
  const actor = useClubScreenActor();
  return useSelector(actor, (state) => state.context.hostPlayerName);
};
