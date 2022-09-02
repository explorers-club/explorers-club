import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { GlobalStateContext } from '../../state/global.provider';
import { selectHomeActor } from './home.selectors';

export const useHomeActor = () => {
  const { appActor } = useContext(GlobalStateContext);
  return useSelector(appActor, selectHomeActor);
};
