import { useInterpret } from '@xstate/react';
import { FC, useContext } from 'react';
import { TriviaJamServiceMap } from '../../state/service-map.context';
import { ScoreboardPlayerComponent } from './scoreboard-player.component';
import { scoreboardPlayerMachine } from './scoreboard-player.machine';

interface Props {
  userId: string;
  score: number;
}

export const ScoreboardPlayer: FC<Props> = ({ userId, score }) => {
  const { fetchProfile } = useContext(TriviaJamServiceMap);
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
