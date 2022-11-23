import { Button } from '@atoms/Button';
import { FC, useCallback } from 'react';
import { LobbyScreenActor, LobbyScreenEvents } from './lobby-screen.machine';

interface Props {
  screenActor: LobbyScreenActor;
}

export const ReadyFooter: FC<Props> = ({ screenActor }) => {
  const handlePress = useCallback(() => {
    screenActor.send(LobbyScreenEvents.PRESS_READY());
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
      Ready Up
    </Button>
  );
};
