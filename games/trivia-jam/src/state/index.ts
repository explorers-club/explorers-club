export * from './trivia-jam-player.machine';
export * from './trivia-jam.machine';
export * from './trivia-jam.selectors';

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
