import { FC } from 'react';
import { ScoreboardPlayerComponent } from './scoreboard-player.component';

interface Props {
  userId: string;
  score: number;
}

export const ScoreboardPlayer: FC<Props> = ({ userId, score }) => {
  // TODO use react-query here to fetch name given userid
  return <ScoreboardPlayerComponent name={userId} score={score} />;
};
