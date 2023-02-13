import { Text } from '@atoms/Text';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { RadioCardGroup, ListRadioCard } from '@molecules/RadioCard';
import { FC, useCallback } from 'react';
import { ITrueOrFalseFields } from '@explorers-club/contentful-types';
import { Caption } from '@atoms/Caption';

interface Props {
  fields: ITrueOrFalseFields;
  onSubmitResponse: (response: boolean) => void;
}

export const TrueOrFalseQuestionComponent: FC<Props> = ({
  fields,
  onSubmitResponse,
}) => {
  const { prompt } = fields;

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
    <Flex direction="column" gap="2" css={{ p: '$3' }}>
      <Caption>Fact.</Caption>
      <Heading size="2">{prompt}</Heading>
      <RadioCardGroup onValueChange={handleChange}>
        <ListRadioCard value="true" css={{ mb: '$2', width: '100%' }}>
          <Text
            size="5"
            css={{ fontWeight: '500', lineHeight: '25px', mr: '$6' }}
          >
            True
          </Text>
        </ListRadioCard>
        <ListRadioCard value="false" css={{ mb: '$2', width: '100%' }}>
          <Text
            size="5"
            css={{ fontWeight: '500', lineHeight: '25px', mr: '$6' }}
          >
            False
          </Text>
        </ListRadioCard>
      </RadioCardGroup>
    </Flex>
  );
};
