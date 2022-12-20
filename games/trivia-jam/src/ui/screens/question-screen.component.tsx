import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { CONTINUE } from '@explorers-club/commands';
import { useObservableState } from 'observable-hooks';
import { FC, useCallback } from 'react';
import { useIsHost, useTriviaJamRoom } from '../../state/trivia-jam.hooks';
import { IQuestion } from '../../types';
import { createCountdown$ } from '../../utils';
import { MultipleAnswerQuestion } from '../components/questions/multiple-answer-question/multiple-answer-question.container';
import { MultipleChoiceQuestion } from '../components/questions/multiple-choice-question/multiple-choice-question.container';
import { NumberInputQuestion } from '../components/questions/number-input-question/number-input-question.container';
import { TextInputQuestion } from '../components/questions/text-input-question/text-input-question.container';
import { TrueOrFalseQuestion } from '../components/questions/true-or-false-question/true-or-false-question.container';

interface Props {
  question: IQuestion;
}

const contentTypeIdToComponentMap = {
  multipleAnswer: MultipleAnswerQuestion,
  multipleChoice: MultipleChoiceQuestion,
  numberInput: NumberInputQuestion,
  textInput: TextInputQuestion,
  trueOrFalse: TrueOrFalseQuestion,
};

export const QuestionScreenComponent: FC<Props> = ({ question }) => {
  const isHost = useIsHost();

  const contentTypeId = question.sys.contentType.sys.id;
  const PlayerQuestionScreen = contentTypeIdToComponentMap[contentTypeId];

  return (
    <Box css={{ p: '$3' }}>
      {isHost ? (
        <HostQuestionScreen question={question} />
      ) : (
        <PlayerQuestionScreen question={question} />
      )}
    </Box>
  );
};

interface HostScreenProps {
  question: IQuestion;
}

const countdown$ = createCountdown$(5);

const HostQuestionScreen: FC<HostScreenProps> = ({ question }) => {
  const room = useTriviaJamRoom();
  const secondsLeft = useObservableState(countdown$);

  const handlePressContinue = useCallback(() => {
    room.send(CONTINUE);
  }, [room]);

  return (
    <Flex direction="column">
      <Caption>Showing question</Caption>
      <Heading>{question.fields.prompt}</Heading>

      {secondsLeft !== undefined && (
        <Button
          size="3"
          color="primary"
          disabled={secondsLeft > 0}
          onClick={handlePressContinue}
        >
          {secondsLeft > 0 ? <>Continue in ({secondsLeft})</> : <>Continue</>}
        </Button>
      )}
    </Flex>
  );
};
