import {
  ActorType,
  createSharedCollectionMachine,
  getActorId,
  SharedCollectionActor,
  SharedCollectionEvents,
} from '@explorers-club/actor';
import { useInterpret, useSelector } from '@xstate/react';
import { FC, useEffect, useMemo } from 'react';
import { MainComponent } from './main.component';
import {
  DiffusionaryPlayerActor,
  diffusionaryPlayerMachine,
} from './state/diffusionary-player.machine';
import {
  DiffusionarySharedActor,
  diffusionarySharedMachine,
} from './state/diffusionary-shared.machine';
import { db } from './__test/emulator';

const sharedCollectionMachine = createSharedCollectionMachine({
  machines: {
    [ActorType.DIFFUSIONARY_PLAYER_ACTOR]: diffusionaryPlayerMachine,
    [ActorType.DIFFUSIONARY_SHARED_ACTOR]: diffusionarySharedMachine,
  },
});

interface Props {
  gameInstanceId: string;
  userId: string;
}

export const Main: FC<Props> = ({ gameInstanceId, userId }) => {
  const rootPath = `diffusionary/${gameInstanceId}`;
  const myActorId = getActorId(ActorType.DIFFUSIONARY_PLAYER_ACTOR, userId);
  const sharedActorId = getActorId(
    ActorType.DIFFUSIONARY_SHARED_ACTOR,
    gameInstanceId
  );

  const initialCollectionContext = {
    actorRefs: {},
    rootPath,
    myActorId,
    db,
  };
  const machine = useMemo(
    () => sharedCollectionMachine.withContext(initialCollectionContext),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameInstanceId]
  );
  const sharedCollectionActor = useInterpret(machine);
  const sharedActor = useSelector(
    sharedCollectionActor,
    (state) =>
      state.context.actorRefs[sharedActorId] as
        | DiffusionarySharedActor
        | undefined
  );

  const myActor = useSelector(
    sharedCollectionActor,
    (state) =>
      state.context.actorRefs[myActorId] as DiffusionaryPlayerActor | undefined
  );

  if (!sharedActor) {
    return null;
  }

  const SpawnMyActorComponent =
    userId && !myActor ? (
      <SpawnMyActor
        sharedCollectionActor={sharedCollectionActor}
        userId={userId}
      />
    ) : null;

  return (
    <>
      <MainComponent
        sharedCollectionActor={sharedCollectionActor}
        sharedActor={sharedActor}
      />
      {SpawnMyActorComponent}
    </>
  );
};

interface SpawnMyActorProps {
  sharedCollectionActor: SharedCollectionActor;
  userId?: string;
}

const SpawnMyActor: FC<SpawnMyActorProps> = ({
  sharedCollectionActor,
  userId,
}) => {
  useEffect(() => {
    if (userId) {
      sharedCollectionActor.send(
        SharedCollectionEvents.SPAWN(
          getActorId(ActorType.DIFFUSIONARY_PLAYER_ACTOR, userId)
        )
      );
    }
  }, [sharedCollectionActor, userId]);

  return null;
};
