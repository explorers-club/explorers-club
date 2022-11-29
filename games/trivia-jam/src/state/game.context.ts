import { SharedCollectionActor } from '@explorers-club/actor';
import { createContext } from 'react';
import { TriviaJamSharedActor } from './trivia-jam-shared.machine';

export const GameContext = createContext({
  triviaJamSharedActor: {} as TriviaJamSharedActor,
  sharedCollectionActor: {} as SharedCollectionActor,
});
