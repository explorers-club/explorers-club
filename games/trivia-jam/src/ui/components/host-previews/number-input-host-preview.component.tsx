import React, { FC } from 'react';
import { Flex } from '@atoms/Flex';
import { createCountdown$ } from '../../../utils';
import { Button } from '@atoms/Button';
import { Heading } from '@atoms/Heading';
import { Caption } from '@atoms/Caption';
import { useObservableState } from 'observable-hooks';

const countdown$ = createCountdown$(5);

interface Props {
  prompt: string;
  onContinue: () => void;
}

export const NumberInputHostPreviewComponent: FC<Props> = ({
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
