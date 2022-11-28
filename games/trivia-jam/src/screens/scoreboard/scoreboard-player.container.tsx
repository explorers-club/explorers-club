import { useInterpret } from '@xstate/react';
import { FC, useContext } from 'react';
import { TriviaJamServices } from '../../state/services.context';
import { ScoreboardPlayerComponent } from './scoreboard-player.component';
import { scoreboardPlayerMachine } from './scoreboard-player.machine';

interface Props {
  userId: string;
  score: number;
}

export const ScoreboardPlayer: FC<Props> = ({ userId, score }) => {
  const { fetchProfile } = useContext(TriviaJamServices);
  const actor = useInterpret(scoreboardPlayerMachine, {
    context: {
      userId,
      score,
    },
    services: {
      fetchProfile,
    },
  });

  return <ScoreboardPlayerComponent actor={actor} />;
};
