import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectUserId } from './auth.selectors';
import { GlobalStateContext } from './global.provider';

export const useAuthActor = () => {
  const { authActor } = useContext(GlobalStateContext);
  return authActor;
};

export const useUserId = () => {
  const authActor = useAuthActor();
  return useSelector(authActor, selectUserId);
};
