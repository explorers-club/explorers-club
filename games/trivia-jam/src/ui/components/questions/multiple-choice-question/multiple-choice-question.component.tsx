import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { Heading } from '@atoms/Heading';
import { RadioCardGroup, RadioCard } from '@molecules/RadioCard';
import { FC, useCallback } from 'react';

interface Props {
  prompt: string;
  answers: string[];
  onSubmitResponse: (selectedAnswer: string) => void;
}

export const MultipleChoiceQuestionComponent: FC<Props> = ({
  prompt,
  answers,
  onSubmitResponse,
}) => {
  const handleChange = useCallback(
    (value: string) => {
      onSubmitResponse(value);
    },
    [onSubmitResponse]
  );

  return (
    <Flex direction="column">
      <Heading size="4">{prompt}</Heading>
      <RadioCardGroup onValueChange={handleChange}>
        {[
          answers.map((answer, index) => (
            <RadioCard
              key={index}
              value={answer}
              css={{ mb: '$2', width: '100%' }}
            >
              <Flex css={{ alignItems: 'center' }}>
                <Text
                  size="5"
                  css={{ fontWeight: '500', lineHeight: '25px', mr: '$6' }}
                >
                  {answer}
                </Text>
              </Flex>
            </RadioCard>
          )),
        ]}
      </RadioCardGroup>
    </Flex>
  );
};
