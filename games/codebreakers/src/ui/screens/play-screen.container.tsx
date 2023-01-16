import { useCallback } from 'react';
import {
  useCodebreakersSelector,
  useMyUserId,
} from '../../state/codebreakers.hooks';
import { PlayScreenComponent } from './play-screen.component';

export const PlayScreen = () => {
  const board = useCodebreakersSelector((state) => state.board);
  const myUserId = useMyUserId();
  const myPlayer = useCodebreakersSelector((state) => state.players[myUserId]);
  const myTeam = myPlayer.team;
  const tripWord = useCodebreakersSelector((state) => state.tripWord);

  const handlePressWord = useCallback((word: string) => {
    console.log('press', word);
  }, []);

  const handleLongPressWord = useCallback((word: string) => {
    console.log('long', word);
  }, []);

  return (
    <PlayScreenComponent
      board={board}
      isClueGiver={myPlayer.clueGiver}
      myTeam={myTeam}
      tripWord={tripWord}
      onLongPressWord={handleLongPressWord}
      onPressWord={handlePressWord}
    />
  );
};
