import { useCallback } from 'react';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
} from '../../../state/little-vigilante.hooks';
import { VoteGridComponent } from './vote-grid.component';

export const VoteGrid = () => {
  const send = useLittleVigilanteSend();
  const timeRemaining = useLittleVigilanteSelector(
    (state) => state.timeRemaining
  );

  const countsByPlayerId = useLittleVigilanteSelector((state) => {
    return Object.entries(state.currentRoundVotes).reduce(
      (acc, [userId, votedUserId]) => {
        if (acc[votedUserId]) {
          acc[votedUserId]++;
        } else {
          acc[votedUserId] = 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );
  });

  const playerVoteCounts = useLittleVigilanteSelector((state) => {
    return Object.entries(state.players).map(([userId, player]) => {
      return {
        userId,
        name: player.name,
        count: countsByPlayerId[userId] || 0,
        slotNumber: player.slotNumber,
      };
    });
  });

  const handleSubmitVote = useCallback(
    (votedUserId: string) => {
      send({ type: 'VOTE', votedUserId });
    },
    [send]
  );

  return (
    <VoteGridComponent
      timeRemaining={timeRemaining}
      playerVoteCounts={playerVoteCounts}
      onSubmitVote={handleSubmitVote}
    />
  );
};
