import { Flex } from '@atoms/Flex';
import { useLottie } from 'lottie-react';
import animationData from './introduction-animation.json';

export const IntroductionScreenComponent = () => {
  const options = {
    animationData,
    loop: true,
  };

  const { View } = useLottie(options);

  return <Flex>{View}</Flex>;
};
