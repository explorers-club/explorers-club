import { Button } from '@atoms/Button';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';
import { FC, useMemo } from 'react';
import { IQuestionFields, IQuestionType } from '../../types';
import { MultipleAnswerReview } from '../components/reviews/multiple-answer-review.container';
import { MultipleChoiceReview } from '../components/reviews/multiple-choice-review.container';
import { NumberInputReview } from '../components/reviews/number-input-review.container';
import { TextInputReview } from '../components/reviews/text-input-review.container';
import { TrueOrFalseReview } from '../components/reviews/true-or-false-review.container';

const contentTypeToReviewComponent = {
  multipleAnswer: MultipleAnswerReview,
  multipleChoice: MultipleChoiceReview,
  numberInput: NumberInputReview,
  textInput: TextInputReview,
  trueOrFalse: TrueOrFalseReview,
};

interface Props {
  fields: IQuestionFields;
  contentType: IQuestionType;
  currentQuestionPointsByName: Partial<Record<string, number>>;
  showContinue: boolean;
  onPressContinue: () => void;
}

export const ReviewScreenComponent: FC<Props> = ({
  contentType,
  fields,
  currentQuestionPointsByName,
  showContinue,
  onPressContinue,
}) => {
  const QuestionReview = contentTypeToReviewComponent[contentType];

  const correctPlayers = useMemo(() => {
    return Object.entries(currentQuestionPointsByName)
      .filter(([_, points]) => points && points > 0)
      .map(([name, points]) => name);
  }, [currentQuestionPointsByName]);

  return (
    <Flex css={{ p: '$3' }} direction="column" gap="2">
      <Heading size="3">{fields.prompt}</Heading>
      <QuestionReview />
      <Heading>Who got it right?</Heading>
      {correctPlayers.length ? (
        <Flex direction="column">
          {correctPlayers.map((name) => (
            <Text key={name}>
              {name} (+{currentQuestionPointsByName[name]})
            </Text>
          ))}
        </Flex>
      ) : (
        <Text>Nobody!</Text>
      )}
      {showContinue && (
        <Button size="3" fullWidth color="primary" onClick={onPressContinue}>
          Continue
        </Button>
      )}
    </Flex>
  );
};
