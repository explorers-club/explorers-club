import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectUserId } from './auth.selectors';
import { GlobalStateContext } from './global.provider';

export const useUserId = () => {
  const { authActor } = useContext(GlobalStateContext);
  return useSelector(authActor, selectUserId);
};
