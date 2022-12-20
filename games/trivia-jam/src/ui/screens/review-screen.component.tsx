import { Button } from '@atoms/Button';
import { Card } from '@atoms/Card';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';
import { CONTINUE } from '@explorers-club/commands';
import {
  IMultipleAnswerFields,
  IMultipleChoiceFields,
  INumberInputFields,
  ITextInputFields,
  ITrueOrFalseFields,
} from '@explorers-club/contentful-types';
import { useObservableState } from 'observable-hooks';
import { FC, useCallback } from 'react';
import { useRoomStateSelector } from '@explorers-club/utils';
import { useIsHost, useTriviaJamRoom, useCurrentQuestionPoints } from '../../state/trivia-jam.hooks';
import { selectPlayers } from '../../state/trivia-jam.selectors';
import { IQuestion } from '../../types';
import { createCountdown$, unwrapFields } from '../../utils';

interface Props {
  question: IQuestion;
}

export const ReviewScreenComponent: FC<Props> = ({ question }) => {
  const isHost = useIsHost();
  const room = useTriviaJamRoom();
  const currentQuestionPoints = useCurrentQuestionPoints();
  const players = useRoomStateSelector(room, selectPlayers);
  console.log(players, currentQuestionPoints);
  // room.state.currentQuestionPoints
  const correctPlayers = players.filter((player) => {
    const points = currentQuestionPoints.get(player.userId);
    return points && points > 0;
  });

  return (
    <Flex direction="column" css={{ p: '$3' }} gap="3">
      <Caption>Review</Caption>
      <Heading size="1">{question.fields.prompt}</Heading>
      <Card css={{ p: '$3' }}>
        <Answer question={question} />
      </Card>
      <Heading>Who got it right?</Heading>
      {correctPlayers.length ? (
        <Flex direction="column">
          {correctPlayers.map((player) => (
            <Text key={player.userId}>
              {player.name} (+{currentQuestionPoints.get(player.userId)})
            </Text>
          ))}
        </Flex>
      ) : (
        <Text>Nobody!</Text>
      )}
      {isHost && <ContinueButton />}
    </Flex>
  );
};

const countdown$ = createCountdown$(5);

interface AnswerProps {
  question: IQuestion;
}

const Answer: FC<AnswerProps> = ({ question }) => {
  const contentType = question.sys.contentType.sys.id;

  switch (contentType) {
    case 'multipleAnswer':
      return (
        <MultipleAnswerAnswer
          fields={unwrapFields<IMultipleAnswerFields>(
            question,
            'multipleAnswer'
          )}
        />
      );
    case 'multipleChoice':
      return (
        <MultipleChoiceAnswer
          fields={unwrapFields<IMultipleChoiceFields>(
            question,
            'multipleChoice'
          )}
        />
      );
    case 'textInput':
      return (
        <TextInputAnswer
          fields={unwrapFields<ITextInputFields>(question, 'textInput')}
        />
      );
    case 'numberInput':
      return (
        <NumberInputAnswer
          fields={unwrapFields<INumberInputFields>(question, 'numberInput')}
        />
      );
    case 'trueOrFalse':
      return (
        <TrueOrFalseAnswer
          fields={unwrapFields<ITrueOrFalseFields>(question, 'trueOrFalse')}
        />
      );
    default:
      return null;
  }
};

const TextInputAnswer = ({ fields }: { fields: ITextInputFields }) => {
  return <Heading size="3">{fields.correctAnswer}</Heading>;
};

const NumberInputAnswer = ({ fields }: { fields: INumberInputFields }) => {
  return <Heading size="3">{fields.correctValue}</Heading>;
};

const TrueOrFalseAnswer = ({ fields }: { fields: ITrueOrFalseFields }) => {
  return <Heading size="3">{fields.answer ? 'True' : 'False'}</Heading>;
};

const MultipleChoiceAnswer = ({
  fields,
}: {
  fields: IMultipleChoiceFields;
}) => {
  return (
    <Flex direction="column">
      <Caption>Correct answer</Caption>
      <Heading>{fields.correctAnswer}</Heading>
    </Flex>
  );
};

const MultipleAnswerAnswer = ({
  fields,
}: {
  fields: IMultipleAnswerFields;
}) => {
  return (
    <Flex direction="column">
      <Heading>Correct Answers</Heading>
      {/* // TODO why are these nullable */}
      {fields.correctAnswers!.map((answer) => (
        <Text key={answer}>{answer}</Text>
      ))}
      <Heading>Incorrect Answers</Heading>
      {fields.incorrectAnswers!.map((answer) => (
        <Text key={answer}>{answer}</Text>
      ))}
    </Flex>
  );
};

const ContinueButton = () => {
  const room = useTriviaJamRoom();
  const secondsLeft = useObservableState(countdown$);

  const handlePressContinue = useCallback(() => {
    room.send(CONTINUE);
  }, [room]);

  return secondsLeft !== undefined ? (
    <Button
      size="3"
      color="primary"
      disabled={secondsLeft > 0}
      onClick={handlePressContinue}
    >
      {secondsLeft > 0 ? <>Continue in ({secondsLeft})</> : <>Continue</>}
    </Button>
  ) : null;
};
