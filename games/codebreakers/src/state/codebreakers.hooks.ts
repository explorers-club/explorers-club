import {
  CodebreakersStateSerialized,
  useStoreSelector,
} from '@explorers-club/room';
import { useContext } from 'react';
import { CodebreakersContext } from './codebreakers.context';

export const useMyUserId = () => {
  const { myUserId } = useContext(CodebreakersContext);
  return myUserId;
};

export const useIsHost = () => {
  const { myUserId } = useContext(CodebreakersContext);
  return useCodebreakersSelector((state) =>
    state.hostUserIds.includes(myUserId)
  );
};

export const useCodebreakersSend = () => {
  const { store } = useContext(CodebreakersContext);
  return store.send;
};

export const useCodebreakersSelector = <T>(
  selector: (state: CodebreakersStateSerialized) => T
) => {
  const { store } = useContext(CodebreakersContext);
  return useStoreSelector(store, selector);
};
