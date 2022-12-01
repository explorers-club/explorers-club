import { SharedCollectionActor } from '@explorers-club/actor';
import { createContext } from 'react';

export const GameContext = createContext({
  sharedCollectionActor: {} as SharedCollectionActor,
});
