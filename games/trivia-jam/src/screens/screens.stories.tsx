import {
  ActorID,
  ActorType,
  createSharedCollectionMachine,
  getActorId,
  SharedCollectionActor,
} from '@explorers-club/actor';
import { useEffect } from '@storybook/addons';
import { Meta, Story } from '@storybook/react';
import { useInterpret } from '@xstate/react';
import { Database } from 'firebase/database';
import { createContext, useContext, useMemo } from 'react';
import { Observable } from 'rxjs';
import { interpret } from 'xstate';
import {
  createTriviaJamPlayerMachine,
  createTriviaJamSharedMachine,
  TriviaJamSharedAllPlayersLoadedEvent,
  TriviaJamSharedHostPressContinueEvent,
  TriviaJamSharedResponseCompleteEvent,
  TriviaJamSharedShowQuestionPromptCompleteEvent,
} from '../state';
import { GameContext } from '../state/game.context';
import { db } from './emulator-db';
import { Screens } from './screens.container';

const allPlayersLoaded$ =
  new Observable<TriviaJamSharedAllPlayersLoadedEvent>();
const hostPressContinue$ =
  new Observable<TriviaJamSharedHostPressContinueEvent>();
const showQuestionPromptComplete$ =
  new Observable<TriviaJamSharedShowQuestionPromptCompleteEvent>();
const responseComplete$ =
  new Observable<TriviaJamSharedResponseCompleteEvent>();

const triviaJamSharedMachine = createTriviaJamSharedMachine({
  services: {
    onAllPlayersLoaded: () => allPlayersLoaded$,
    onHostPressContinue: () => hostPressContinue$,
    onShowQuestionPromptComplete: () => showQuestionPromptComplete$,
    onResponseComplete: () => responseComplete$,
  },
});

const meta = {
  component: Screens,
  decorators: [
    (Story: Story, { parameters }) => {
      const sharedCollectionActor = parameters[
        'sharedCollectionActor'
      ] as SharedCollectionActor;

      return (
        <GameContext.Provider value={{ sharedCollectionActor }}>
          <Story />
        </GameContext.Provider>
      );
    },
  ],
} as Meta;

const sharedCollectionMachine = createSharedCollectionMachine({
  machines: {
    [ActorType.TRIVIA_JAM_PLAYER_ACTOR]: createTriviaJamPlayerMachine(),
    [ActorType.TRIVIA_JAM_SHARED_ACTOR]: triviaJamSharedMachine,
  },
}).withContext({
  actorRefs: {},
  rootPath: 'trivia_jam/foobar',
  myActorId: getActorId(ActorType.TRIVIA_JAM_PLAYER_ACTOR, 'buzbar'),
  db,
});

const Template: Story = () => {
  return <Screens />;
};

export const PlayerRunThrough = Template.bind({});

PlayerRunThrough.parameters = {
  sharedCollectionActor: interpret(sharedCollectionMachine).start(),
};

// const getSharedStateJSON = (context: TriviaJamSharedContext) => {
//   const actor = interpret(triviaJamSharedMachine.withContext(context));
//   return JSON.stringify(actor.getSnapshot());
// };

// PlayerRunThrough.args = {
//   fetchActorsData: {
//     [getActorId(ActorType.TRIVIA_JAM_SHARED_ACTOR, 'foobar')]:
//       getSharedStateJSON({
//         playerUserIds: ['p1', 'p2', 'p3'],
//         hostUserIds: ['h1', 'h2'],
//         scores: {},
//       }),
//   },
//   sharedCollectionContext: {
//     actorRefs: {},
//     rootPath: 'trivia_jam/foobar',
//     myActorId: getActorId(ActorType.TRIVIA_JAM_SHARED_ACTOR, 'foobar'),
//   },
// };

PlayerRunThrough.play = (context) => {
  const sharedCollectionActor = context.parameters['sharedCollectionActor'];
};

export default meta;
