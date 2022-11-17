import { useChildActor } from '../../../state/utils';
import { useClubScreenActor } from '../club-screen.hooks';
import { LobbyScreenActor } from './lobby-screen.machine';

export const useLobbyScreenActor = () => {
  const actor = useClubScreenActor();
  return useChildActor<LobbyScreenActor>(actor, 'Lobby');
};
