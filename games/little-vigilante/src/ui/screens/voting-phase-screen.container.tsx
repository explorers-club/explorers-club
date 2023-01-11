import { useCallback } from 'react';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
} from '../../state/little-vigilante.hooks';
import { VotingPhaseScreenComponent } from './voting-phase-screen.component';

export const VotingPhaseScreen = () => {
  const send = useLittleVigilanteSend();
  const timeRemaining = useLittleVigilanteSelector(
    (state) => state.timeRemaining
  );
  const playerVoteCounts = useLittleVigilanteSelector((state) => {
    const count = 0;
    return Object.entries(state.players).map(([userId, player]) => ({
      userId,
      name: player.name,
      count,
    }));
  });

  const handleSubmitVote = useCallback((votedUserId: string) => {
    send({ type: 'VOTE', votedUserId });
  }, []);

  return (
    <VotingPhaseScreenComponent
      timeRemaining={timeRemaining}
      playerVoteCounts={playerVoteCounts}
      onSubmitVote={handleSubmitVote}
    />
  );
};
