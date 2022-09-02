import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectIsLoggedIn } from '../../state/auth.selectors';
import { GlobalStateContext } from '../../state/global.provider';

export const useIsLoggedIn = () => {
  const { appActor } = useContext(GlobalStateContext);
  return useSelector(appActor, selectIsLoggedIn);
};
