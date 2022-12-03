import { SharedCollectionActor } from '@explorers-club/actor';
import { createContext } from 'react';
import { TriviaJamPlayerActor } from './trivia-jam-player.machine';

export const GameContext = createContext({
  sharedCollectionActor: {} as SharedCollectionActor,
  myActor: undefined as TriviaJamPlayerActor | undefined,
});
