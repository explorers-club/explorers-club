import {
  ActorType,
  createActorByIdSelector,
  createSharedCollectionMachine,
  getActorId,
  selectActorRefs,
  selectActorsInitialized,
  selectMyActor,
  SharedCollectionEvents,
} from '@explorers-club/actor';
import { noop } from '@explorers-club/utils';
import { Meta, Story } from '@storybook/react';
import { useInterpret, useSelector } from '@xstate/react';
import { ref, set } from 'firebase/database';
import { useEffect, useMemo } from 'react';
import { createSelector } from 'reselect';
import { filter, firstValueFrom, merge, Observable } from 'rxjs';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import {
  createTriviaJamPlayerMachine,
  TriviaJamPlayerActor,
  TriviaJamPlayerEvents,
  TriviaJamSharedHostPressContinueEvent,
  triviaJamSharedMachine,
  TriviaJamSharedResponseCompleteEvent,
  TriviaJamSharedServices,
  TriviaJamSharedShowQuestionPromptCompleteEvent,
} from '../state';
import { GameContext } from '../state/game.context';
import { selectPlayerIsReady } from '../state/trivia-jam-player.selectors';
import {
  onAllPlayersLoaded,
  onHostPressContinue,
} from '../state/trivia-jam-shared.services';
import { Screens } from './screens.container';
import { db } from './__test/emulator';

const meta = {
  component: Screens,
} as Meta;

const myUserId = 'buzz';
const myActorId = getActorId(ActorType.TRIVIA_JAM_PLAYER_ACTOR, myUserId);

const playerUserIds = ['foo', 'bar', 'buzbar', myUserId];
const playerActorIds = playerUserIds.map((userId) =>
  getActorId(ActorType.TRIVIA_JAM_PLAYER_ACTOR, userId)
);
const hostUserIds = ['buzbar'];

const profileName = 'foobar1';
const rootPath = `trivia_jam/${profileName}`;
const sharedActorId = getActorId(
  ActorType.TRIVIA_JAM_SHARED_ACTOR,
  profileName
);

const Template: Story = () => {
  const triviaJamPlayerMachine = createTriviaJamPlayerMachine();
  const sharedCollectionMachine = createSharedCollectionMachine({
    machines: {
      [ActorType.TRIVIA_JAM_PLAYER_ACTOR]: triviaJamPlayerMachine,
      [ActorType.TRIVIA_JAM_SHARED_ACTOR]: triviaJamSharedMachine,
    },
  });

  const machine = useMemo(() => {
    // Hack way of resetting the db each iterations...
    set(ref(db), null).then(noop);

    return sharedCollectionMachine.withContext({
      actorRefs: {},
      rootPath,
      myActorId,
      db,
    });
  }, []);

  const sharedCollectionActor = useInterpret(machine);

  const myActor = useSelector(
    sharedCollectionActor,
    selectMyActor<TriviaJamPlayerActor>
  );

  useEffect(() => {
    waitFor(sharedCollectionActor, selectActorsInitialized).then(() => {
      sharedCollectionActor.send(
        SharedCollectionEvents.SPAWN(myActorId, {
          playerName: 'BuzzLightyear',
        })
      );
    });
  }, [sharedCollectionActor]);

  // console.log('lo');
  // useEffect(() => {
  //   console.log('spawning buzz');
  //   sharedCollectionActor.send(
  //     SharedCollectionEvents.SPAWN(myActorId, {
  //       playerName: 'BuzzLightyear',
  //       isHost: false,
  //     })
  //   );
  // }, []);

  return (
    <GameContext.Provider value={{ sharedCollectionActor, myActor }}>
      <Screens />
    </GameContext.Provider>
  );
};

export const PlayerRunThrough = Template.bind({});

PlayerRunThrough.play = async ({ args }) => {
  // Mock the services and data we would normally fetch and inject on the server
  const services: TriviaJamSharedServices = {
    onAllPlayersLoaded: ({ playerUserIds }) =>
      onAllPlayersLoaded(sharedCollectionActor, playerUserIds),

    showQuestionPromptComplete$: () =>
      new Observable<TriviaJamSharedShowQuestionPromptCompleteEvent>(),

    onHostPressContinue: ({ hostUserIds }) =>
      onHostPressContinue(sharedCollectionActor, hostUserIds),

    responseComplete$: (context) =>
      new Observable<TriviaJamSharedResponseCompleteEvent>(),
  };

  const triviaJamPlayerMachine = createTriviaJamPlayerMachine();
  const sharedCollectionMachine = createSharedCollectionMachine({
    machines: {
      [ActorType.TRIVIA_JAM_PLAYER_ACTOR]: triviaJamPlayerMachine,
      [ActorType.TRIVIA_JAM_SHARED_ACTOR]: triviaJamSharedMachine.withConfig({
        services,
      }),
    },
  });

  const initialCollectionContext = {
    actorRefs: {},
    rootPath,
    myActorId: sharedActorId,
    db,
  };

  // Spawn the shared collection and wait until it exists
  const sharedCollectionActor = interpret(
    sharedCollectionMachine.withContext(initialCollectionContext)
  ).start();
  await waitFor(sharedCollectionActor, selectActorsInitialized);
  const initialSharedContext = {
    playerUserIds,
    hostUserIds,
    scores: {
      foo: 0,
      bar: 0,
      buzz: 0,
    },
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
  const spawnFakePlayerActors = async () => {
    const spawnFakePlayerActor = async (userId: string) => {
      const actorId = getActorId(ActorType.TRIVIA_JAM_PLAYER_ACTOR, userId);
      if (actorId === myActorId) {
        return;
      }

      const context = {
        playerName: userId,
      };

      // Create a unique "throwaway" shaerd collection actor for each player
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

      return selectMyActor<TriviaJamPlayerActor>(
        playerSharedCollectionActor.getSnapshot()
      ) as TriviaJamPlayerActor;
    };

    return await Promise.all(
      playerUserIds
        .filter((userId) => userId !== myUserId)
        .map(spawnFakePlayerActor)
    );
  };

  // Mark all player actors as ready except our own actor
  const otherPlayerActors = await spawnFakePlayerActors();
  otherPlayerActors.forEach((actor) => {
    actor?.send(TriviaJamPlayerEvents.CONTINUE()); // todo fix type on spawn fake player actors
  });
};

export default meta;
