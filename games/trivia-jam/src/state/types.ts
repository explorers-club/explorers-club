import { ActorRefFrom, StateFrom } from 'xstate';
import { createTriviaJamPlayerMachine } from './trivia-jam-player.machine';
import { createTriviaJamMachine } from './trivia-jam.machine';

export type TriviaJamMachine = ReturnType<typeof createTriviaJamMachine>;
export type TriviaJamActor = ActorRefFrom<TriviaJamMachine>;
export type TriviaJamState = StateFrom<TriviaJamMachine>;

export type TriviaJamPlayerMachine = ReturnType<
  typeof createTriviaJamPlayerMachine
>;
export type TriviaJamPlayerState = StateFrom<TriviaJamPlayerMachine>;
export type TriviaJamPlayerActor = ActorRefFrom<TriviaJamPlayerMachine>;

export type GameId = 'TRIVIA_JAM' | 'COCO_COURIERS';

export const GAME_ID: GameId = 'TRIVIA_JAM';

type TriviaJamProps = {
  gameId: 'TRIVIA_JAM';
};

// mock 2nd game to make types work
type CocoCouriersProps = {
  gameId: 'COCO_COURIERS';
};

export type GameProps = TriviaJamProps | CocoCouriersProps;
