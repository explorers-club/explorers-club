import { SharedCollectionActor } from '@explorers-club/actor';
import { useSelector } from '@xstate/react';
import { FC } from 'react';
import { selectIsAwaitingQuestion, selectIsGameOver } from '../state';
import { useTriviaJamSharedActor } from '../state/game.hooks';
import {
  selectIsOnQuestion,
  selectIsStaging,
} from '../state/trivia-jam-shared.selectors';
import { GameEndScreen } from './game-end/game-end-screen.container';
import { IntroductionScreen } from './introduction/introduction-screen.container';
import { QuestionScreen } from './question/question-screen.container';
import { ScoreboardScreen } from './scoreboard/scoreboard-screen.container';

interface Props {
  sharedCollectionActor: SharedCollectionActor;
}

export const ScreensComponent: FC<Props> = ({ sharedCollectionActor }) => {
  const actor = useTriviaJamSharedActor();

  const isStaging = useSelector(actor, selectIsStaging);
  const isAwaitingQuestion = useSelector(actor, selectIsAwaitingQuestion);
  const isOnQuestion = useSelector(actor, selectIsOnQuestion);
  const isGameOver = useSelector(actor, selectIsGameOver);

  switch (true) {
    case isStaging: {
      return <IntroductionScreen />;
    }
    case isAwaitingQuestion: {
      return <ScoreboardScreen />;
    }
    case isOnQuestion: {
      return <QuestionScreen />;
    }
    case isGameOver: {
      return <GameEndScreen />;
    }
    default: {
      return null;
    }
  }
};
