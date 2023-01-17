import { CodebreakersStateSerialized } from '@explorers-club/room';
import { useCallback } from 'react';
import {
  useCodebreakersSelector,
  useCodebreakersSend,
  useMyUserId,
} from '../../state/codebreakers.hooks';
import { PlayScreenComponent } from './play-screen.component';

export const PlayScreen = () => {
  const board = useCodebreakersSelector((state) => state.board);
  const myUserId = useMyUserId();
  const myPlayer = useCodebreakersSelector((state) => state.players[myUserId]);
  const myTeam = myPlayer.team;
  const tripWord = useCodebreakersSelector((state) => state.tripWord);
  const currentStates = useCodebreakersSelector((state) => state.currentStates);
  const currentTeam = useCodebreakersSelector((state) => state.currentTeam);
  const highlightsByWord = useCodebreakersSelector(selectHighlightsByWord);
  const [currentClue, currentClueCount] = useCodebreakersSelector((state) => [
    state.currentClue,
    state.currentClueCount,
  ]);
  const send = useCodebreakersSend();

  const handleEnterClue = useCallback(
    (clue: string, numWords: number) => {
      send({ type: 'CLUE', clue, numWords });
    },
    [send]
  );

  const handlePressWord = useCallback(
    (word: string) => {
      send({ type: 'HIGHLIGHT', word });
    },
    [send]
  );

  const handleLongPressWord = useCallback(
    (word: string) => {
      send({ type: 'GUESS', word });
    },
    [send]
  );

  return (
    <PlayScreenComponent
      board={board}
      isClueGiver={myPlayer.clueGiver}
      myTeam={myTeam}
      tripWord={tripWord}
      currentTeam={currentTeam}
      currentStates={currentStates}
      currentClue={currentClue}
      currentClueCount={currentClueCount}
      highlightsByWord={highlightsByWord}
      onEnterClue={handleEnterClue}
      onLongPressWord={handleLongPressWord}
      onPressWord={handlePressWord}
    />
  );
};

const selectHighlightsByWord = (state: CodebreakersStateSerialized) => {
  const highlightsByWord: Record<string, string[]> = {};
  Object.entries(state.players).forEach(([userId, player]) => {
    player.highlightedWords.forEach((word) => {
      highlightsByWord[word] ||= [];
      highlightsByWord[word].push(player.name);
    });
  });
  return highlightsByWord;
};
