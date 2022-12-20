import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { useObservableState } from 'observable-hooks';
import { FC } from 'react';
import { createCountdown$ } from '../../../utils';

const countdown$ = createCountdown$(5);

interface Props {
  prompt: string;
  onContinue: () => void;
}

export const MultipleChoiceHostPreviewComponent: FC<Props> = ({
  prompt,
  onContinue,
}) => {
  const secondsLeft = useObservableState(countdown$);
  return (
    <Flex direction="column">
      <Caption>Showing question</Caption>
      <Heading>{prompt}</Heading>

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
