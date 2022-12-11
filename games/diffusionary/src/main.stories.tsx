import {
  ActorType,
  createSharedCollectionMachine,
  getActorId,
  selectActorsInitialized,
  selectMyActor,
  selectSharedActor,
  SharedCollectionEvents,
} from '@explorers-club/actor';
import { Meta, Story } from '@storybook/react';
import { ref, set } from 'firebase/database';
import { useMemo } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { createSelector } from 'reselect';
import { noop } from 'rxjs';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import { Main } from './main.container';
import {
  DiffusionaryPlayerActor,
  DiffusionaryPlayerContext,
  diffusionaryPlayerMachine,
} from './state/diffusionary-player.machine';
import {
  DiffusionarySharedContext,
  diffusionarySharedMachine,
  DiffusionarySharedServices,
} from './state/diffusionary-shared.machine';
import {
  onAllPlayersReady,
  onPlayerEnterPrompt,
} from './state/diffusionary-shared.services';
import { db } from './__test/emulator';

export default {
  component: Main,
} as Meta;

// const sharedCollectionMachine = createSharedCollectionMachine({
//   machines: {
//     [ActorType.DIFFUSIONARY_PLAYER_ACTOR]: diffusionaryPlayerMachine,
//     [ActorType.DIFFUSIONARY_SHARED_ACTOR]: diffusionarySharedMachine,
//   },
// });

// type MainStory = ComponentStory<typeof Main> & {otherPlayerIds: string[] };
type MainComponentStory = Story<{
  gameInstanceId: string;
  userId: string;
  players: Record<string, DiffusionaryPlayerContext>;
}>;

export const Primary: MainComponentStory = ({ userId, gameInstanceId }) => {
  useMemo(() => {
    // Hack way of resetting the db each iterations...
    set(ref(db), null).then(noop);
  }, []);

  return <Main gameInstanceId={gameInstanceId} userId={userId} />;
};

Primary.args = {
  gameInstanceId: '12345-abcd',
  userId: 'buzzbar',
  players: {
    foo: {
      playerName: 'Ms. Foo',
    },
    bar: {
      playerName: 'Mr. Bar',
    },
    buzz: {
      playerName: 'Mrs. Buzz',
    },
    buzzbar: {
      playerName: undefined,
    },
  },
};

Primary.play = async (context) => {
  // Mock the services and data we would normally fetch and inject on the server
  const services: DiffusionarySharedServices = {
    onAllPlayersReady: () =>
      onAllPlayersReady(sharedCollectionActor, playerUserIds),

    onPlayerEnterPrompt: () => onPlayerEnterPrompt(),
    // onAllPlayersLoaded: async () => {
    //   console.log('loaded');
    // },

    // onPlayerEnterPrompt: async () => {
    //   console.log('player prompt');
    // },

    // onPlayerSubmitResponse: async () => {
    //   console.log('submit response');
    // },
  };

  const sharedCollectionMachine = createSharedCollectionMachine({
    machines: {
      [ActorType.DIFFUSIONARY_PLAYER_ACTOR]: diffusionaryPlayerMachine,
      [ActorType.DIFFUSIONARY_SHARED_ACTOR]:
        diffusionarySharedMachine.withConfig({
          services,
        }),
    },
  });

  const sharedActorId = getActorId(
    ActorType.DIFFUSIONARY_SHARED_ACTOR,
    context.args.gameInstanceId
  );

  const initialCollectionContext = {
    actorRefs: {},
    rootPath: `diffusionary/${context.args.gameInstanceId}`,
    myActorId: sharedActorId,
    sharedActorId,
    db,
  };

  const myUserId = context.args.userId;
  const playerUserIds = Object.keys(context.args.players);

  // Spawn the shared collection and wait until it exists
  const sharedCollectionActor = interpret(
    sharedCollectionMachine.withContext(initialCollectionContext)
  ).start();
  await waitFor(sharedCollectionActor, selectActorsInitialized);

  // Initialize shared actor, normally this would be done by the lobby actor when a game is started
  const scoresByUserId: Record<string, number> = {};
  playerUserIds.forEach((userId) => (scoresByUserId[userId] = 0));

  const initialSharedContext: DiffusionarySharedContext = {
    playerUserIds,
    currentPlayer: playerUserIds[0],
    scoresByUserId,
    currentRound: 1,
  };
  sharedCollectionActor.send(
    SharedCollectionEvents.SPAWN(sharedActorId, initialSharedContext)
  );
  const selectSharedActorExists = createSelector(
    selectSharedActor,
    (actor) => !!actor
  );
  await waitFor(sharedCollectionActor, selectSharedActorExists);

  // Spawn Fake Players
  // future: DRY up with trivia jam, pull in to testing util
  const myActorId = getActorId(ActorType.DIFFUSIONARY_PLAYER_ACTOR, myUserId);
  const spawnFakePlayerActors = async () => {
    const spawnFakePlayerActor = async (userId: string) => {
      const actorId = getActorId(ActorType.DIFFUSIONARY_PLAYER_ACTOR, userId);
      if (actorId === myActorId) {
        return;
      }

      const initialPlayerContext = context.args.players[userId];

      // Create a unique shared collection actor for each player
      // to simulate spawning from their own clients
      const playerSharedCollectionActor = interpret(
        sharedCollectionMachine.withContext({
          ...initialCollectionContext,
          myActorId: actorId,
        })
      );
      playerSharedCollectionActor.start();

      await waitFor(playerSharedCollectionActor, selectActorsInitialized);
      playerSharedCollectionActor.send(
        SharedCollectionEvents.SPAWN(actorId, initialPlayerContext)
      );

      return selectMyActor<DiffusionaryPlayerActor>(
        playerSharedCollectionActor.getSnapshot()
      ) as DiffusionaryPlayerActor;
    };

    const actors = await Promise.all(
      playerUserIds
        .filter((userId) => userId !== myUserId)
        .map(spawnFakePlayerActor)
    );
    const actorsByUserId: Record<string, DiffusionaryPlayerActor> = {};
    actors.forEach((actor, index) => {
      const userId = playerUserIds[index];
      actorsByUserId[userId] = actor!;
    });
    return actorsByUserId;
  };

  // Mark all player actors as ready except our own actor
  const otherPlayerActorsByUserId = await spawnFakePlayerActors();

  // Object.entries(otherPlayerActorsByUserId).forEach(([_, actor]) => {
  //   actor?.send(TriviaJamPlayerEvents.CONTINUE()); // todo fix type on spawn fake player actors
  // });
  // const mainHostActor = otherPlayerActorsByUserId[mainHostUserId];

  // Have the host press continue
  // await sleep(7000);
  // console.log('sending continue');
  // mainHostActor.send(TriviaJamPlayerEvents.CONTINUE());
  // console.log('sent');
};

Primary.parameters = {
  layout: 'fullscreen',
};
