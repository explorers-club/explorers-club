import {
  ActorType,
  createActorByIdSelector,
  createSharedCollectionMachine,
  getActorId,
  selectActorsInitialized,
  selectMyActor,
  SharedCollectionEvents,
} from '@explorers-club/actor';
import { contentfulClient } from '@explorers-club/contentful';
import { IQuestionSet } from '@explorers-club/contentful-types';
import { noop, sleep } from '@explorers-club/utils';
import { Meta, Story } from '@storybook/react';
import { useInterpret, useSelector } from '@xstate/react';
import { ref, set } from 'firebase/database';
import { useEffect, useMemo } from 'react';
import { createSelector } from 'reselect';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import {
  createTriviaJamPlayerMachine,
  TriviaJamPlayerActor,
  TriviaJamPlayerEvents,
  triviaJamSharedMachine,
  TriviaJamSharedServices,
} from '../state';
import { GameContext } from '../state/game.context';
import {
  onAllPlayersLoaded,
  onHostPressContinue,
  onResponseComplete,
  onShowQuestionPromptComplete,
} from '../state/trivia-jam-shared.services';
import { Screens } from './screens.container';
import { db } from './__test/emulator';

const meta = {
  component: Screens,
} as Meta;

const sampleQuestionSetEntryId = '3Xd6DkL434TO1AFYI1TME2';

const myUserId = 'buzz';
const myActorId = getActorId(ActorType.TRIVIA_JAM_PLAYER_ACTOR, myUserId);

const playerUserIds = ['foo', 'bar', 'buzbar', myUserId];
const hostUserIds = ['buzbar'];
const mainHostUserId = hostUserIds[0];

const profileName = 'foobar1';
const rootPath = `trivia_jam/${profileName}`;
const sharedActorId = getActorId(
  ActorType.TRIVIA_JAM_SHARED_ACTOR,
  profileName
);

const triviaJamPlayerMachine = createTriviaJamPlayerMachine();
const sharedCollectionMachine = createSharedCollectionMachine({
  machines: {
    [ActorType.TRIVIA_JAM_PLAYER_ACTOR]: triviaJamPlayerMachine,
    [ActorType.TRIVIA_JAM_SHARED_ACTOR]: triviaJamSharedMachine,
  },
});

const Template: Story = () => {
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

PlayerRunThrough.loaders = [
  async () => ({
    questionSetEntry: await contentfulClient.getEntry<IQuestionSet>(
      sampleQuestionSetEntryId
    ),
  }),
];

PlayerRunThrough.play = async ({ loaded }) => {
  const questionSetEntry = loaded['questionSetEntry'] as IQuestionSet;

  // Mock the services and data we would normally fetch and inject on the server
  const services: TriviaJamSharedServices = {
    loadNextQuestion: async ({ currentQuestionIndex }) => {
      const questions = questionSetEntry.fields.questions;
      return questions[currentQuestionIndex];
    },

    onAllPlayersLoaded: ({ playerUserIds }) =>
      onAllPlayersLoaded(sharedCollectionActor, playerUserIds),

    onShowQuestionPromptComplete: () => onShowQuestionPromptComplete(),

    onHostPressContinue: ({ hostUserIds }) =>
      onHostPressContinue(sharedCollectionActor, hostUserIds),

    onResponseComplete: (context) => onResponseComplete(),
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
      buzbar: 0,
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

    const actors = await Promise.all(
      playerUserIds
        .filter((userId) => userId !== myUserId)
        .map(spawnFakePlayerActor)
    );
    const actorsByUserId: Record<string, TriviaJamPlayerActor> = {};
    actors.forEach((actor, index) => {
      const userId = playerUserIds[index];
      actorsByUserId[userId] = actor!;
    });
    return actorsByUserId;
  };

  // Mark all player actors as ready except our own actor
  const otherPlayerActorsByUserId = await spawnFakePlayerActors();
  Object.entries(otherPlayerActorsByUserId).forEach(([_, actor]) => {
    actor?.send(TriviaJamPlayerEvents.CONTINUE()); // todo fix type on spawn fake player actors
  });
  const mainHostActor = otherPlayerActorsByUserId[mainHostUserId];

  // Have the host press continue
  await sleep(7000);
  console.log('sending continue');
  mainHostActor.send(TriviaJamPlayerEvents.CONTINUE());
  console.log('sent');
};

export default meta;
