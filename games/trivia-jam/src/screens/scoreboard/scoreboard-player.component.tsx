import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { useSelector } from '@xstate/react';
import { FC } from 'react';
import { ScoreboardPlayerActor } from './scoreboard-player.machine';

interface Props {
  actor: ScoreboardPlayerActor;
}

export const ScoreboardPlayerComponent: FC<Props> = ({ actor }) => {
  const name = useSelector(actor, (state) => state.context.name);
  const userId = useSelector(actor, (state) => state.context.userId);
  const score = useSelector(actor, (state) => state.context.score);

  return (
    <Flex justify="between">
      <Heading size="4">{name ? name : userId}</Heading>
      <Heading size="4">{score}</Heading>
    </Flex>
  );
};
