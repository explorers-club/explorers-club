import { SharedCollectionActor } from '@explorers-club/actor';
import { createContext } from 'react';

export const MainContext = createContext({
  sharedCollectionActor: {} as SharedCollectionActor,
  userId: undefined as string | undefined,
});
