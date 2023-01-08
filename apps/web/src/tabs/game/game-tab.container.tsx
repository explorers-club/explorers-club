import { useContext } from 'react';
import { AppContext } from '../../state/app.context';
import { GameTabComponent } from './game-tab.component';

export const GameTab = () => {
  const { gameTabActor } = useContext(AppContext);
  return <GameTabComponent actor={gameTabActor} />;
};
