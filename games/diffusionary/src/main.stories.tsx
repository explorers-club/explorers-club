import {
  ActorType,
  createActorByIdSelector,
  createSharedCollectionMachine,
  getActorId,
  selectActorsInitialized,
  selectMyActor,
  SharedCollectionEvents,
} from '@explorers-club/actor';
import { Meta, Story } from '@storybook/react';
import { createSelector } from 'reselect';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import { Main } from './main.container';
import {
  DiffusionaryPlayerActor,
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

export default { component: Main } as Meta;

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
  otherPlayerIds: string[];
}>;

export const Primary: MainComponentStory = (args) => {
  return <Main {...args} />;
};

Primary.args = {
  gameInstanceId: '12345-abcd',
  userId: 'buzbar',
  otherPlayerIds: ['foo', 'bar', 'buz'],
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
    db,
  };

  const myUserId = context.args.userId;
  const playerUserIds = [...context.args.otherPlayerIds, myUserId];

  // Spawn the shared collection and wait until it exists
  const sharedCollectionActor = interpret(
    sharedCollectionMachine.withContext(initialCollectionContext)
  ).start();
  await waitFor(sharedCollectionActor, selectActorsInitialized);
  const initialSharedContext: DiffusionarySharedContext = {
    playerUserIds,
    scoresByUserId: {
      foo: 0,
      bar: 0,
      buzbar: 0,
      buzz: 0,
    },
    currentPlayer: 'foo',
    currentRound: 1,
  };
  sharedCollectionActor.send(
    SharedCollectionEvents.SPAWN(sharedActorId, initialSharedContext)
  );
  const selectSharedActor = createActorByIdSelector(sharedActorId);
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

      const context = {
        playerName: userId,
      };

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
        SharedCollectionEvents.SPAWN(actorId, context)
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

  console.log(otherPlayerActorsByUserId);

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
