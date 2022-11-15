import { Box } from '@atoms/Box';
import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectIsAwaitingJudgement } from '../state';
import { GameContext } from '../state/game.context';
import { AwaitingJudgement } from './awaiting-judgement';
import { AwaitingQuestion } from './awaiting-question';
import { AwaitingResponse } from './awaiting-response';

export const Screens = () => {
  const { gameActor } = useContext(GameContext);
  console.log({ gameActor });

  // TODO add bottom sheet here? or in main-ui ?
  return (
    <>
      <AwaitingJudgement />
      <AwaitingQuestion />
      <AwaitingResponse />
    </>
  );
};
