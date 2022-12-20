import { FC, useCallback, useEffect, useState } from 'react';
import { IQuestion } from '../types';
import { MultipleAnswerQuestion } from './multiple-answer-question.container';
import { useObservableState, useSubscription } from 'observable-hooks';
import { MultipleChoiceQuestion } from './multiple-choice-question.container';
import { TrueOrFalseQuestion } from './true-or-false-question.container';
import { NumberInputQuestion } from './number-input-question.container';
import { TextInputQuestion } from './text-input-question.container';
import { Box } from '@atoms/Box';
import { Heading } from '@atoms/Heading';
import { useIsHost, useTriviaJamRoom } from '../state/trivia-jam.hooks';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Button } from '@atoms/Button';
import { CONTINUE } from '@explorers-club/commands';
import { createCountdown$ } from '../utils';

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
