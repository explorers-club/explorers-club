import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { GlobalStateContext } from '../../state/global.provider';
import { selectClubScreenActor } from '../../state/navigation.selectors';

export const useClubScreenActor = () => {
  const { navigationActor } = useContext(GlobalStateContext);
  const actor = useSelector(navigationActor, selectClubScreenActor);

  if (!actor) {
    throw new Error(
      'tried to access club screen actor out of expected context'
    );
  }

  return actor;
};

export const useHostPlayerName = () => {
  const actor = useClubScreenActor();
  return useSelector(actor, (state) => state.context.hostPlayerName);
};
