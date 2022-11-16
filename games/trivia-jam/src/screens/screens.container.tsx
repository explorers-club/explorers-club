import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import {
  selectIsAwaitingJudgement,
  selectIsAwaitingQuestion,
  selectIsAwaitingResponse,
} from '../state';
import { GameContext } from '../state/game.context';
import { AwaitingJudgementScreen } from './awaiting-judgement';
import { AwaitingQuestionScreen } from './awaiting-question';
import { AwaitingResponseScreen } from './awaiting-response';

export const Screens = () => {
  const { gameActor } = useContext(GameContext);

  const isAwaitingJudgement = useSelector(gameActor, selectIsAwaitingJudgement);
  const isAwaitingQuestion = useSelector(gameActor, selectIsAwaitingQuestion);
  const isAwaitingResponse = useSelector(gameActor, selectIsAwaitingResponse);

  switch (true) {
    case isAwaitingJudgement: {
      return <AwaitingJudgementScreen />;
    }
    case isAwaitingQuestion: {
      return <AwaitingQuestionScreen />;
    }
    case isAwaitingResponse: {
      return <AwaitingResponseScreen />;
    }
    default: {
      return null;
    }
  }
};
