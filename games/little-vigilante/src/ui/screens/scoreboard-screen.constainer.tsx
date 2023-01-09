import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import { ScoreboardScreenComponent } from './scoreboard-screen.component';

export const ScoreboardScreen = () => {
  const isHost = true; // todo pull from hostUserId
  const players = useLittleVigilanteSelector((state) =>
    Object.values(state.players)
  );
  console.log({ isHost, players });
  return <ScoreboardScreenComponent showNext={isHost} players={players} />;
};
