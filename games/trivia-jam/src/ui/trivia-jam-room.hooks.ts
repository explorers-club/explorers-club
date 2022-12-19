import { useContext, useEffect, useState } from 'react';
import { TriviaJamRoomContext } from './trivia-jam-room.context';

export const useTriviaJamRoom = () => {
  const { room } = useContext(TriviaJamRoomContext);
  return room;
};

export const useMyUserId = () => {
  const { myUserId } = useContext(TriviaJamRoomContext);
  return myUserId;
};

export const useCurrentStates = () => {
  const room = useTriviaJamRoom();

  const [states, setStates] = useState(
    Array.from(room.state.currentStates.values())
  );

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
