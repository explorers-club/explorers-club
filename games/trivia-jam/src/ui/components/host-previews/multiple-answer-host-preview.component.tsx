import { FC } from 'react';
import { Avatar } from '@atoms/Avatar';
import { Flex } from '@atoms/Flex';
import { Card } from '@atoms/Card';
import { Badge } from '@atoms/Badge';
import { createCountdown$ } from '../../../utils';
import { Button } from '@atoms/Button';
import { Heading } from '@atoms/Heading';
import { Caption } from '@atoms/Caption';
import { useObservableState } from 'observable-hooks';
import { IMultipleAnswerFields } from '@explorers-club/contentful-types';

const countdown$ = createCountdown$(5);

interface Props {
  fields: IMultipleAnswerFields;
  responsesByPlayerName: Partial<Record<string, string[]>>;
  onContinue: () => void;
}

export const MultipleAnswerHostPreviewComponent: FC<Props> = ({
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
              {response &&
                response.map((answer, index) => (
                  <Badge key={index} size="2">
                    {answer}
                  </Badge>
                ))}
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
