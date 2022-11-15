import { createContext } from 'react';
import { TriviaJamActor } from './trivia-jam.machine';

export const GameContext = createContext({
  gameActor: {} as TriviaJamActor,
});
