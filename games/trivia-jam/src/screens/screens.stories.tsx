import {
  ActorType,
  createActorByIdSelector,
  createSharedCollectionMachine,
  getActorId,
  selectActorRefs,
  selectActorsInitialized,
  SharedCollectionEvents,
} from '@explorers-club/actor';
import { noop } from '@explorers-club/utils';
import { Meta, Story } from '@storybook/react';
import { useInterpret } from '@xstate/react';
import { ref, set } from 'firebase/database';
import { useMemo } from 'react';
import { createSelector } from 'reselect';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import {
  createTriviaJamPlayerMachine,
  createTriviaJamSharedMachine,
  triviaJamSharedServices,
} from '../state';
import { GameContext } from '../state/game.context';
import { db } from './emulator-db';
import { Screens } from './screens.container';

const meta = {
  component: Screens,
} as Meta;

const myUserId = 'buzz';
const myActorId = getActorId(ActorType.TRIVIA_JAM_PLAYER_ACTOR, myUserId);

const playerUserIds = ['foo', 'bar', 'buzz', 'buzbar'];
const playerActorIds = playerUserIds.map((userId) =>
  getActorId(ActorType.TRIVIA_JAM_PLAYER_ACTOR, userId)
);
const hostUserIds = ['buzbar'];

const triviaJamSharedMachine = createTriviaJamSharedMachine({
  services: triviaJamSharedServices,
}).withContext({
  playerUserIds,
  hostUserIds,
  scores: {
    foo: 0,
    bar: 0,
    buzz: 0,
  },
});

const triviaJamPlayerMachine = createTriviaJamPlayerMachine();

const sharedCollectionMachine = createSharedCollectionMachine({
  machines: {
    [ActorType.TRIVIA_JAM_PLAYER_ACTOR]: triviaJamPlayerMachine,
    [ActorType.TRIVIA_JAM_SHARED_ACTOR]: triviaJamSharedMachine,
  },
});

const profileName = 'foobar1';
const rootPath = `trivia_jam/${profileName}`;
const sharedActorId = getActorId(
  ActorType.TRIVIA_JAM_SHARED_ACTOR,
  profileName
);

const Template: Story = () => {
  const machine = useMemo(() => {
    // Hack way of resetting the db each iterations...
    set(ref(db), null).then(noop);

    return sharedCollectionMachine.withContext({
      actorRefs: {},
      rootPath,
      myActorId: getActorId(ActorType.TRIVIA_JAM_PLAYER_ACTOR, 'buzbar'),
      db,
    });
  }, []);

  const sharedCollectionActor = useInterpret(machine);

  return (
    <GameContext.Provider value={{ sharedCollectionActor }}>
      <Screens />
    </GameContext.Provider>
  );
};

export const PlayerRunThrough = Template.bind({});

PlayerRunThrough.play = async ({ args }) => {
  const sharedCollectionActor = interpret(
    sharedCollectionMachine.withContext({
      actorRefs: {},
      rootPath,
      myActorId: sharedActorId,
      db,
    })
  ).start();

  // Spawn the shared actor once the colleciton is initialized (and can spawn)
  await waitFor(sharedCollectionActor, selectActorsInitialized);
  sharedCollectionActor.send(SharedCollectionEvents.SPAWN(sharedActorId));

  const selectSharedActor = createActorByIdSelector(sharedActorId);
  const selectSharedActorExists = createSelector(
    selectSharedActor,
    (actor) => !!actor
  );

  await waitFor(sharedCollectionActor, selectSharedActorExists);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // const sharedActor = selectSharedActor(sharedCollectionActor.getSnapshot()!)!;

  // const selectSharedActor(sharedCollectionActor.getSnapshot()!)

  // await waitFor(sharedCollectionActor, );

  // Spawn Fake Players
  playerUserIds.forEach((userId) => {
    const actorId = getActorId(ActorType.TRIVIA_JAM_PLAYER_ACTOR, userId);
    const context = {
      userId,
      isHost: false,
      playerName: userId,
    };

    sharedCollectionActor.send(SharedCollectionEvents.SPAWN(actorId, context));
  });

  hostUserIds.forEach((userId) => {
    const actorId = getActorId(ActorType.TRIVIA_JAM_PLAYER_ACTOR, userId);
    const context = {
      userId,
      isHost: true,
      playerName: userId,
    };

    sharedCollectionActor.send(SharedCollectionEvents.SPAWN(actorId, context));
  });

  // actorIds.forEach((actorId) => {
  //   sharedCollectionActor.send(SharedCollectionEvents.SPAWN(actorId, {

  //   }));
  // });

  const selectAllActorsLoaded = createSelector(selectActorRefs, (actorRefs) => {
    const missingCount = playerActorIds.filter(
      (actorId) => !actorRefs[actorId]
    ).length;
    return missingCount === 0;
  });
  await waitFor(sharedCollectionActor, selectAllActorsLoaded);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const actorRefs = selectActorRefs(sharedCollectionActor.getSnapshot()!)!;
  console.log(actorRefs);

  // sharedCollectionActor.send(SharedCollectionEvents.SPAWN(otherActorIdA));
  // sharedCollectionActor.send(SharedCollectionEvents.SPAWN(otherActorIdB));

  // const selectActorA = createSelector(
  //   selectActorRefs,
  //   (actorRefs) => actorRefs[otherActorIdA]
  // );
  // const selectActorAExists = createSelector(selectActorA, (actor) => !!actor);
  // await waitFor(sharedCollectionActor, selectActorAExists);

  // sharedCollectionActor.send(SharedCollectionEvents.SPAWN(otherPlayerA));
  // sharedCollectionActor.send(SharedCollectionEvents.SPAWN(otherPlayerB));

  // Seed trivia jam shared with the playe rids and hosts
  // How should those actors spawn?
};

export default meta;
