import {
  ActorType,
  createSharedCollectionMachine,
  getActorId,
} from '@explorers-club/actor';
import { useInterpret, useSelector } from '@xstate/react';
import { FC, useMemo } from 'react';
import { MainComponent } from './main.component';
import { MainContext } from './main.context';
import { diffusionaryPlayerMachine } from './state/diffusionary-player.machine';
import {
  DiffusionarySharedActor,
  diffusionarySharedMachine,
} from './state/diffusionary-shared.machine';
import { db } from './__test/emulator';
0
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
    sharedActorId,
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

  if (!sharedActor) {
    return null;
  }

  return (
    <MainContext.Provider
      value={{
        sharedCollectionActor,
        userId,
      }}
    >
      <MainComponent />
    </MainContext.Provider>
  );
};

// const playerInitialContext = {
//   playerName: undefined,
// };

// const SpawnMyActor = () => {
//   const { userId, sharedCollectionActor } = useContext(MainContext);
//   const myActor = useSelector(
//     sharedCollectionActor,
//     (state) =>
//       userId &&
//       (state.context.actorRefs[
//         getActorId(ActorType.DIFFUSIONARY_PLAYER_ACTOR, userId)
//       ] as DiffusionaryPlayerActor | undefined)
//   );

//   useEffect(() => {
//     if (userId && !myActor) {
//       sharedCollectionActor.send(
//         SharedCollectionEvents.SPAWN(
//           getActorId(ActorType.DIFFUSIONARY_PLAYER_ACTOR, userId),
//           playerInitialContext
//         )
//       );
//     }
//   }, [sharedCollectionActor, userId, myActor]);

//   return null;
// };
