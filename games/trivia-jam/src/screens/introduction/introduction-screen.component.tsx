import { Flex } from '@atoms/Flex';
import { FC } from 'react';
import { IntroductionScreenActor } from './introduction-screen.machine';

interface Props {
  actor: IntroductionScreenActor;
}

export const IntroductionScreenComponent: FC<Props> = ({ actor }) => {
  return <Flex>Intro screen</Flex>;
};
