import { Text } from '@atoms/Text';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { RadioCardGroup, RadioCard } from '@molecules/RadioCard';
import { FC, useCallback } from 'react';

interface Props {
  prompt: string;
  onSubmitResponse: (response: boolean) => void;
}

export const TrueOrFalseQuestionComponent: FC<Props> = ({
  prompt,
  onSubmitResponse,
}) => {
  const handleChange = useCallback(
    (value: string) => {
      if (value === 'true') {
        onSubmitResponse(true);
      } else if (value === 'false') {
        onSubmitResponse(false);
      }
    },
    [onSubmitResponse]
  );

  return (
    <Flex direction="column" gap="3">
      <Heading size="3">{prompt}</Heading>
      <RadioCardGroup onValueChange={handleChange}>
        <RadioCard value="true" css={{ mb: '$2', width: '100%' }}>
          <Text
            size="5"
            css={{ fontWeight: '500', lineHeight: '25px', mr: '$6' }}
          >
            True
          </Text>
        </RadioCard>
        <RadioCard value="false" css={{ mb: '$2', width: '100%' }}>
          <Text
            size="5"
            css={{ fontWeight: '500', lineHeight: '25px', mr: '$6' }}
          >
            False
          </Text>
        </RadioCard>
      </RadioCardGroup>
    </Flex>
  );
};
