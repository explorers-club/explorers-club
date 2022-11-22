import { Button } from '@atoms/Button';
import { useCallback } from 'react';
import { useLobbyScreenActor } from './lobby-screen.hooks';
import { LobbyScreenEvents } from './lobby-screen.machine';

export const JoinFooter = () => {
  const screenActor = useLobbyScreenActor();

  const handlePress = useCallback(() => {
    screenActor.send(LobbyScreenEvents.PRESS_JOIN());
  }, [screenActor]);
  //     if (!userId) {
  //       console.error('tried to join without being logged in');
  //       return;
  //     }

  //     const actorId = getActorId(ActorType.LOBBY_PLAYER_ACTOR, userId);
  //     sharedCollectionActor.send(SharedCollectionEvents.SPAWN(actorId));
  //   }, [sharedCollectionActor, userId]);

  return (
    <Button size="3" color="blue" fullWidth onClick={handlePress}>
      Join Party
    </Button>
  );
};
