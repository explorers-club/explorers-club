import { Avatar } from '@atoms/Avatar';
import { Badge } from '@atoms/Badge';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { IMultipleChoiceFields } from '@explorers-club/contentful-types';
import { useObservableState } from 'observable-hooks';
import { FC } from 'react';
import { createCountdown$ } from '../../../utils';

const countdown$ = createCountdown$(5);

interface Props {
  fields: IMultipleChoiceFields;
  responsesByPlayerName: Partial<Record<string, string>>;
  onContinue: () => void;
}

export const MultipleChoiceHostPreviewComponent: FC<Props> = ({
  fields,
  responsesByPlayerName,
  onContinue,
}) => {
  const secondsLeft = useObservableState(countdown$);
  return (
    <Flex direction="column" css={{ p: '$3' }} gap="3">
      <Caption>Showing question</Caption>
      <Heading>{fields.prompt}</Heading>
      <Flex direction="column" gap="2">
        {Object.entries(responsesByPlayerName).map(([playerName, response]) => (
          <Card key={playerName} css={{ p: '$3' }}>
            <Flex gap="1">
              <Avatar size="2" fallback={playerName[0]} />
              {response && <Badge size="2">{response}</Badge>}
            </Flex>
          </Card>
        ))}
      </Flex>
      {secondsLeft !== undefined && (
        <Button
          size="3"
          color="primary"
          disabled={secondsLeft > 0}
          onClick={onContinue}
        >
          {secondsLeft > 0 ? <>Continue in ({secondsLeft})</> : <>Continue</>}
        </Button>
      )}
    </Flex>
  );
};
