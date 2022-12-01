import { Flex } from '@atoms/Flex';
import { useTriviaJamSharedActor } from '../../state/game.hooks';
import { QuestionScreenComponent } from './question-screen.component';

export const QuestionScreen = () => {
  // const actor = useTriviaJamSharedActor();
  // return <QuestionScreenComponent actor={actor} />;
  return <Flex>Question screen</Flex>;
};
