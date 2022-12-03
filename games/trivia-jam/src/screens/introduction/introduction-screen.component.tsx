// Example of controlling lottie by segment
// https://github.com/guipacheco2/instalura/blob/1147755302fe5e250c041f53780e3ae5b73aca43/projetos/ui/src/components/animations/HeartAnimation.tsx
import { Button } from '@atoms/Button';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { useLottie } from 'lottie-react';
import { FC, useRef, useState } from 'react';
import animationData from './introduction-animation.json';

interface Props {
  onCompleteIntro?: () => void;
  playerName: string;
}

export const IntroductionScreenComponent: FC<Props> = ({
  onCompleteIntro,
  playerName,
}) => {
  const loopCountRef = useRef(0);

  const { View } = useLottie({
    animationData,
    loop: true,
    onLoopComplete: () => {
      loopCountRef.current++;

      // Simulate loading of game assets as intro scenes playing
      if (loopCountRef.current === 3) {
        onCompleteIntro && onCompleteIntro();
      }
    },
  });

  return (
    <Flex direction="column" css={{ p: '$3' }}>
      <Heading size="3">Welcome {playerName}</Heading>
      {View}
    </Flex>
  );
};
