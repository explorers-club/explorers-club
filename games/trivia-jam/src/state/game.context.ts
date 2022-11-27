import { createContext } from 'react';
import { TriviaJamSharedActor } from './trivia-jam-shared.machine';

export const GameContext = createContext({
  sharedService: {} as TriviaJamSharedActor,
});
