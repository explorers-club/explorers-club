import { FC } from 'react';

interface Props {
  timeRemaining: number;
}

export const DiscussionPhaseScreenComponent: FC<Props> = ({
  timeRemaining,
}) => {
  return <>Discussion phase: {timeRemaining} seconds left</>;
};
