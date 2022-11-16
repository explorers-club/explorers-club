import { createContext } from 'react';
import { TriviaJamActor } from './types';

export const GameContext = createContext({
  gameActor: {} as TriviaJamActor,
});
