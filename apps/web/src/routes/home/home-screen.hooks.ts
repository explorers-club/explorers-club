import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { GlobalStateContext } from '../../state/global.provider';
import { selectHomeScreenActor } from './home-screen.selectors';

export const useHomeScreenActor = () => {
  const { appActor } = useContext(GlobalStateContext);
  return useSelector(appActor, selectHomeScreenActor);
};
