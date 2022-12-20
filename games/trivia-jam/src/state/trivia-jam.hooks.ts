import { useContext, useEffect, useState } from 'react';
import { TriviaJamContext } from './trivia-jam.context';

export const useTriviaJamRoom = () => {
  const { room } = useContext(TriviaJamContext);
  return room;
};

export const useMyUserId = () => {
  const { myUserId } = useContext(TriviaJamContext);
  return myUserId;
};

export const useIsHost = () => {
  const myUserId = useMyUserId();
  const room = useTriviaJamRoom();
  return myUserId === room.state.hostUserId;
};

export const useCurrentQuestionPoints = () => {
  const room = useTriviaJamRoom();

  const [value, setValue] = useState(room.state.currentQuestionPoints);

  useEffect(() => {
    // todo remove on unmount
    room.onStateChange((state) => {
      setValue(state.currentQuestionPoints);
    });
  });

  return value;
};

export const useCurrentStates = () => {
  const room = useTriviaJamRoom();

  const [states, setStates] = useState(
    Array.from(room.state.currentStates.values())
  );

  // useLayoutEffect here instead?
  useEffect(() => {
    // todo remove on unmount
    room.onStateChange((state) => {
      setStates(Array.from(state.currentStates.values()));
    });
  });

  return states;
};

export const useCurrentQuestionEntryId = () => {
  const room = useTriviaJamRoom();

  const [value, setValue] = useState<string | undefined>(
    room.state.currentQuestionEntryId
  );

  useEffect(() => {
    // todo remove on unmount
    room.onStateChange((state) => {
      setValue(room.state.currentQuestionEntryId);
    });
  });

  return value;
};
