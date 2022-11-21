import { ConnectionStatus } from './connection-status.component';
import { useSharedCollectionActor } from './lobby-screen.hooks';
import { PlayerList } from './player-list.component';

export const LobbyScreenComponent = () => {
  const actor = useSharedCollectionActor();

  return (
    <>
      <ConnectionStatus />
      <PlayerList />
    </>
  );
};
