import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { GlobalStateContext } from '../../state/global.provider';

export const useHomeScreenActor = () => {
  const { navigationActor } = useContext(GlobalStateContext);
  return useSelector(
    navigationActor,
    (state) => state.children['homeScreenMachine']
  );
};

export const useHomeScreenState = () => {
  const homeScreenActor = useHomeScreenActor();
  return useSelector(homeScreenActor, (state) => state);
};
