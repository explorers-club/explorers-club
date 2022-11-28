import { ScoreboardScreenComponent } from './scoreboard-screen.component';
import { useScoreboardScreenActor } from './scoreboard-screen.hooks';

export const ScoreboardScreen = () => {
  const actor = useScoreboardScreenActor();
  return <ScoreboardScreenComponent actor={actor} />;
};
