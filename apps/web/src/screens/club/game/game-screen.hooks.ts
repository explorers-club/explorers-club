import { useChildActor } from '../../../state/utils';
import { useClubScreenActor } from '../club-screen.hooks';
import { GameScreenActor } from './game-screen.machine';

export const useGameScreenActor = () => {
  const actor = useClubScreenActor();
  return useChildActor<GameScreenActor>(actor, 'Game');
};
