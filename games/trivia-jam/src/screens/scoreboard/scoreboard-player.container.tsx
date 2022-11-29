import { useSelector } from '@xstate/react';
import { FC } from 'react';
import { TriviaJamPlayerActor } from '../../state/types';
import { ScoreboardPlayerComponent } from './scoreboard-player.component';

interface Props {
  actor: TriviaJamPlayerActor;
  score: number;
}

export const ScoreboardPlayer: FC<Props> = ({ actor, score }) => {
  const playerName = useSelector(actor, (state) => state.context.playerName);

  return <ScoreboardPlayerComponent name={playerName} score={score} />;
};
