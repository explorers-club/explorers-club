import { Flex } from '@atoms/Flex';
import { FC } from 'react';
import { IntroductionScreenActor } from './introduction-screen.machine';

interface Props {
  title: string;
  actor: IntroductionScreenActor;
}

export const IntroductionScreenComponent: FC<Props> = ({ title, actor }) => {
  console.log({ actor });
  return <Flex>{title} screen</Flex>;
};
