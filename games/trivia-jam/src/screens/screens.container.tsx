import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import {
  selectIsAwaitingJudgement,
  selectIsAwaitingQuestion,
  selectIsAwaitingResponse
} from '../state';
import { GameContext } from '../state/game.context';
import { AwaitingJudgement } from './awaiting-judgement';

export const Screens = () => {
  const { gameActor } = useContext(GameContext);
  console.log({ gameActor });

  const isAwaitingJudgement = useSelector(gameActor, selectIsAwaitingJudgement);
  const isAwaitingQuestion = useSelector(gameActor, selectIsAwaitingQuestion);
  const isAwaitingResponse = useSelector(gameActor, selectIsAwaitingResponse);

  switch (true) {
    case isAwaitingJudgement: {
      return <AwaitingJudgement />;
    }
    case isAwaitingQuestion: {
      return <AwaitingJudgement />;
    }
    case isAwaitingResponse: {
      return <AwaitingJudgement />;
    }
    default: {
      return null;
    }
  }
};
