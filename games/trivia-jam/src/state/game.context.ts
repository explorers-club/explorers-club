import { ActorManager } from '@explorers-club/actor';
import { createContext } from 'react';

export const GameContext = createContext({
  actorManager: {} as ActorManager,
});
