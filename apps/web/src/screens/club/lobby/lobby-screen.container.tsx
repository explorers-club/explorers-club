import { useSelector } from '@xstate/react';
import { useActorLogger } from '../../../lib/logging';
import { memo, useCallback } from 'react';
import { useClubScreenActor } from '../club-screen.hooks';
import { selectLobbyScreenActor } from '../club-screen.selectors';
import { Button } from '@atoms/Button';
import { useFooter } from '../../../state/footer.hooks';
import { LobbyScreenComponent } from './lobby-screen.component';
import { useSharedCollectionActor } from './lobby-screen.hooks';
import {
  ActorType,
  getActorId,
  SharedCollectionEvents,
} from '@explorers-club/actor';
import { useUserId } from '../../../state/auth.hooks';

export const LobbyScreen = memo(() => {
  const actor = useClubScreenActor();
  const lobbyActor = useSelector(actor, selectLobbyScreenActor);
  useFooter(<LobbyFooter />);
  console.log({ lobbyActor });

  return <LobbyScreenComponent />;
});

const LobbyFooter = () => {
  const userId = useUserId();
  const sharedCollectionActor = useSharedCollectionActor();

  const handlePress = useCallback(() => {
    if (!userId) {
      console.error('tried to join without being logged in');
      return;
    }

    const actorId = getActorId(ActorType.LOBBY_PLAYER_ACTOR, userId);
    sharedCollectionActor.send(SharedCollectionEvents.SPAWN(actorId));
  }, [sharedCollectionActor, userId]);
  return (
    <Button size="3" color="blue" fullWidth onClick={handlePress}>
      Join Party
    </Button>
  );
};
